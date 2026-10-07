import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RssClient } from "@/components/RssClient";

export const metadata: Metadata = {
  title: "RSS 2.0 Syndication Feed | NewsFlow",
  description: "Subscribe to real-time machine-readable RSS 2.0 feeds generated continuously by the NewsFlow agentic pipeline.",
};

export const revalidate = 60;

export default async function RssFeedPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [articles, categories, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      orderBy: { published_at: "desc" },
      take: 8,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { status: "published" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.article.count({ where: { status: "published" } }),
  ]);

  const serializedArticles = articles.map((art) => ({
    id: art.id,
    slug: art.slug,
    title: art.title,
    summary: art.summary,
    cover_image_url: art.cover_image_url,
    published_at: art.published_at.toISOString(),
    reading_time_minutes: art.reading_time_minutes,
    category: art.category,
  }));

  return (
    <RssClient
      articles={serializedArticles}
      categories={categories}
      totalArticles={totalArticles}
      initialSiteUrl={siteUrl}
    />
  );
}
