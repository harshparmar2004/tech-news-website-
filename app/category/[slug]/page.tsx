import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightAdsSidebar } from "@/components/RightAdsSidebar";
import { CategoryFeedClient } from "@/components/CategoryFeedClient";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: "Category Not Found | NewsFlow" };

  return {
    title: `${category.name} Intelligence | NewsFlow`,
    description: category.description || `Latest autonomous news and analysis in ${category.name}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [category, categories, totalArticles] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { status: "published" },
          orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
          include: { category: true },
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

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FAF7F0] dark:bg-[#121211]">
      {/* 1. Left Sidebar: Fixed & Non-Scrollable */}
      <div className="hidden lg:block shrink-0">
        <LeftSidebar
          categories={categories}
          activeSlug={category.slug}
          totalArticles={totalArticles}
        />
      </div>

      {/* 2. Middle Main Content: Scrollable Top to Down */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto px-5 sm:px-8 py-6">
        <CategoryFeedClient category={category} />
      </main>

      {/* 3. Right Sidebar: Future Ad Slots (Fixed) */}
      <div className="hidden xl:block shrink-0">
        <RightAdsSidebar domain={category.slug} />
      </div>
    </div>
  );
}