import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyApiKey, verifyAdminSession } from "@/lib/auth";
import { generateSlug, calculateReadingTime } from "@/lib/utils";
import { getThematicCoverImage } from "@/lib/imagePool";

/**
 * GET /api/articles
 * Query published articles with pagination and filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const status = searchParams.get("status") || "published";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status !== "all") {
      where.status = status;
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { published_at: "desc" },
        skip,
        take: limit,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles
 * Autonomous Agent Publishing Endpoint (API Key authenticated)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify API Key or Admin Session
    const isApiKeyValid = await verifyApiKey(req);
    const adminSession = await verifyAdminSession();

    if (!isApiKeyValid && !adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing API key (x-api-key header)",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 2. Validate mandatory fields (support aliases)
    const title = (body.title || body.headline || "").trim();
    const bodyContent = (body.body || body.content || body.article || "").trim();
    const summary = (
      body.summary ||
      body.description ||
      body.excerpt ||
      (bodyContent.length > 250 ? bodyContent.slice(0, 250) + "..." : bodyContent)
    ).trim();

    if (!title || !bodyContent) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title (or headline) and body (or content) are mandatory.",
        },
        { status: 400 }
      );
    }

    // 2b. Duplicate protection: same source_url => return existing article
    if (body.source_url) {
      const duplicate = await prisma.article.findFirst({
        where: { source_url: body.source_url },
        include: { category: true },
      });
      if (duplicate) {
        return NextResponse.json(
          {
            success: true,
            duplicate: true,
            message: "Article with this source_url already exists",
            article: {
              id: duplicate.id,
              slug: duplicate.slug,
              url: `/article/${duplicate.slug}`,
              title: duplicate.title,
              status: duplicate.status,
              published_at: duplicate.published_at,
              category: duplicate.category.name,
            },
          },
          { status: 200 }
        );
      }
    }

    const categoryName = body.category || body.domain || "AI & Robotics";
    const categorySlug = generateSlug(categoryName);

    let category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: categorySlug }, { name: categoryName }],
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
          description: `Latest articles in ${categoryName}`,
        },
      });
    }

    // Resolve cover image (accept flexible aliases or assign thematic pool image)
    const rawCover =
      body.cover_image_url ||
      body.image_url ||
      body.image ||
      body.lead_image_url ||
      body.cover_image ||
      body.photo ||
      null;

    const finalCoverImage =
      rawCover && typeof rawCover === "string" && rawCover.trim().length > 0
        ? rawCover.trim()
        : getThematicCoverImage(category.slug, title);

    // 4. Resolve slug and timestamps
    let slug = body.slug ? generateSlug(body.slug) : generateSlug(title);

    // Ensure slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Resolve published timestamp:
    // When published by the AI agent, set published_at to the current moment (now)
    // unless explicitly scheduled for a future time. This guarantees that newly published
    // news is always at the top of its section (Tech & Innovation, AI & Robotics, etc.)
    const now = new Date();
    let publishedAt = now;
    if (body.published_at) {
      const parsed = new Date(body.published_at);
      if (!isNaN(parsed.getTime()) && parsed > now) {
        publishedAt = parsed;
      }
    }

    // Support scheduled status
    let status = body.status || "published";
    if (publishedAt > now && status === "published") {
      status = "scheduled";
    }

    const readingTime = calculateReadingTime(bodyContent);

    // 5. Create Article Record
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary,
        body: bodyContent,
        cover_image_url: finalCoverImage,
        gallery_images: body.gallery_images
          ? JSON.stringify(body.gallery_images)
          : null,
        categoryId: category.id,
        tags: body.tags
          ? typeof body.tags === "string"
            ? body.tags
            : JSON.stringify(body.tags)
          : null,
        author: body.author || "NewsFlow AI",
        published_at: publishedAt,
        status,
        rank_score: typeof body.rank_score === "number" ? body.rank_score : 75,
        is_featured: Boolean(body.is_featured),
        reading_time_minutes: readingTime,
        source_url: body.source_url || null,
        affiliate_links: body.affiliate_links
          ? JSON.stringify(body.affiliate_links)
          : null,
        seo_meta: body.seo_meta ? JSON.stringify(body.seo_meta) : null,
      },
      include: {
        category: true,
      },
    });

    // 6. Immediate On-Demand Cache Invalidation (ISR)
    try {
      revalidatePath("/", "layout");
      revalidatePath(`/article/${slug}`);
      revalidatePath(`/category/${category.slug}`);
      revalidatePath("/archive");
      revalidatePath("/rss.xml");
      revalidatePath("/sitemap.xml");
    } catch (revalErr) {
      console.warn("ISR revalidation warning:", revalErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Article published successfully",
        article: {
          id: article.id,
          slug: article.slug,
          url: `/article/${article.slug}`,
          title: article.title,
          status: article.status,
          published_at: article.published_at,
          category: article.category.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to publish article" },
      { status: 500 }
    );
  }
}