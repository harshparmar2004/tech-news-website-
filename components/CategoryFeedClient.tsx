"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryDeskBanner } from "@/components/CategoryDeskBanner";
import { useAdPreferences } from "./AdPreferencesContext";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  cover_image_url?: string | null;
  published_at: Date;
  reading_time_minutes: number;
  category: {
    name: string;
    slug: string;
  };
}

interface CategoryFeedClientProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    articles: ArticleItem[];
  };
}

export function CategoryFeedClient({ category }: CategoryFeedClientProps) {
  const { isAdFree } = useAdPreferences();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
        <Link href="/" className="hover:text-[#C96442] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
        <span>Categories</span>
        <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
        <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
          {category.name}
        </span>
      </nav>

      {/* Enhanced Category Desk Banner (Sleek, properly scaled & constrained width) */}
      <CategoryDeskBanner
        title={category.name}
        description={category.description}
        slug={category.slug}
      />

      {/* Dynamic Articles Grid: 2 columns vs 3 columns adjusting for screen */}
      <div className="space-y-6 pt-1">
        <div
          className={`grid gap-6 transition-all duration-200 w-full ${
            isAdFree
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
          }`}
        >
          {category.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {category.articles.length === 0 && (
          <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1A1917] max-w-[840px]">
            <p className="text-sm font-mono text-[#8E8B82]">
              No published stories in this desk yet. The autonomous pipeline will dispatch updates soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
