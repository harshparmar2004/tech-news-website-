import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { HomeFeedClient } from "@/components/HomeFeedClient";

export const revalidate = 60; // Incremental Static Regeneration

export default async function HomePage() {
  // 1. Fetch total published count
  const totalArticles = await prisma.article.count({
    where: { status: "published" },
  });

  // 2. Fetch categories with article counts
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: { where: { status: "published" } } },
      },
    },
    orderBy: { name: "asc" },
  });

  // 3. Fetch top recent articles (6 or 9 items = multiples of 3 for clean rows)
  const recentArticles = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: { published_at: "desc" },
    take: 6,
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  // 4. Fetch 3 articles for each category news desk
  const categorySections = await Promise.all(
    categories
      .filter((cat) => (cat._count?.articles ?? 0) > 0)
      .map(async (category) => {
        const articles = await prisma.article.findMany({
          where: {
            categoryId: category.id,
            status: "published",
          },
          orderBy: { published_at: "desc" },
          take: 3, // Exactly 3 in one row
          include: {
            category: {
              select: { name: true, slug: true },
            },
          },
        });
        return {
          category,
          articles,
        };
      })
  );

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Scrollable Top to Down */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto px-5 sm:px-8 py-6">
        <HomeFeedClient
          recentArticles={recentArticles}
          categorySections={categorySections}
        />
        {/* Footer padding for scroll */}
        <div className="h-10" />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Fixed) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar />
      </div>
    </div>
  );
}