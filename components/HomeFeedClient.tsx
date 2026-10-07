"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryDeskBanner } from "@/components/CategoryDeskBanner";
import { EditorialColophon } from "@/components/EditorialColophon";
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

  // In Ad-Free mode (ads off), display 3 news slide boxes per row (6 recent = 2 rows of 3)
  // When ads are on, display 2 news boxes per row alongside the right ads sidebar
  const displayedRecent = isAdFree ? recentArticles.slice(0, 6) : recentArticles.slice(0, 4);

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
        {/* Section Bar - Clean, properly sized, spans width */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#C96442]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB]">
              Recent Dispatches
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E8B82] dark:text-[#78756E]">
            {isAdFree ? "3-story expanded view" : "2-story view with ads"}
          </span>
        </div>

        {/* Dynamic Grid: 3 news slide boxes when ads off; 2 news boxes next to ads when ads on */}
        <div
          className={`grid gap-6 transition-all duration-200 w-full ${
            isAdFree
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {displayedRecent.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {recentArticles.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1A1917] w-full">
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

          // When Ad-Free is enabled (ads off), show 3 news slide boxes across screen; else show 2 next to ads
          const displayedCategoryArticles = isAdFree ? articles.slice(0, 3) : articles.slice(0, 2);

          return (
            <section key={category.id} className="space-y-4">
              {/* Section Bar - Clean, properly proportioned */}
              <div className="flex items-center justify-between pb-2 border-b border-[#EBE8DF] dark:border-[#262522] w-full">
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

              {/* Dynamic Grid: 3 news slide boxes when ads off; 2 news boxes next to ads when ads on */}
              <div
                className={`grid gap-6 transition-all duration-200 w-full ${
                  isAdFree
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
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

      {/* In-feed colophon footer */}
      <EditorialColophon />
    </div>
  );
}
