"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
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

interface CategorySection {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  articles: ArticleItem[];
}

interface HomeFeedClientProps {
  recentArticles: ArticleItem[];
  categorySections: CategorySection[];
}

export function HomeFeedClient({ recentArticles, categorySections }: HomeFeedClientProps) {
  const { isAdFree } = useAdPreferences();

  // In Ad-Free mode, show 4 recent articles (2 rows of 2), otherwise 6 (2 rows of 3)
  const displayedRecent = isAdFree ? recentArticles.slice(0, 4) : recentArticles;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#8E8B82] dark:text-[#A8A59D]">
        <Link href="/" className="hover:text-[#C96442] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A8A59D]" />
        <span className="text-[#1F1E1D] dark:text-[#F5F2EB] font-medium">
          Recent Intelligence
        </span>
      </nav>

      {/* Enhanced Desk Header Banner - Compact & Properly Sized */}
      <CategoryDeskBanner
        title="All Intelligence"
        description="Autonomous AI-synthesized news desk aggregating breakthrough stories from 50+ global sources 24/7."
        slug="tech"
      />

      {/* Section: Recent Intelligence */}
      <section className="space-y-4 pt-2">
        {/* Compact Section Bar - Smaller in width and sleek */}
        <div
          className={`flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] transition-all duration-200 ${
            isAdFree ? "max-w-[840px]" : "max-w-full"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C96442]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Recent Dispatches
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E8B82] dark:text-[#78756E]">
            {isAdFree ? "2-col focus view" : `${recentArticles.length} latest stories`}
          </span>
        </div>

        {/* Dynamic Grid: 2 articles vs 3 articles with SAME card length and size */}
        <div
          className={`grid gap-5 transition-all duration-200 ${
            isAdFree
              ? "grid-cols-1 sm:grid-cols-2 max-w-[840px]"
              : "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
          }`}
        >
          {displayedRecent.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {recentArticles.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1A1917] max-w-[840px]">
            <p className="text-sm font-mono text-[#8E8B82]">
              No stories indexed yet. Pipeline cycles will stream articles automatically.
            </p>
          </div>
        )}
      </section>

      {/* Dedicated News Type Sections (AI & Robotics, Startups & VC, etc.) */}
      <div className="space-y-9 pt-2">
        {categorySections.map(({ category, articles }) => {
          if (articles.length === 0) return null;

          // When Ad-Free is enabled, show 2 articles instead of 3; else show 3
          const displayedCategoryArticles = isAdFree ? articles.slice(0, 2) : articles.slice(0, 3);

          return (
            <section key={category.id} className="space-y-4">
              {/* Compact Section Bar - Smaller in width, properly proportioned */}
              <div
                className={`flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] transition-all duration-200 ${
                  isAdFree ? "max-w-[840px]" : "max-w-full"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#C96442]" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
                    {category.name}
                  </h3>
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-xs font-mono font-medium text-[#C96442] hover:underline flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C96442]/5 hover:bg-[#C96442]/10 transition-colors"
                >
                  <span>View desk</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Dynamic Grid: 2 articles vs 3 articles with SAME length and size */}
              <div
                className={`grid gap-5 transition-all duration-200 ${
                  isAdFree
                    ? "grid-cols-1 sm:grid-cols-2 max-w-[840px]"
                    : "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
                }`}
              >
                {displayedCategoryArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
