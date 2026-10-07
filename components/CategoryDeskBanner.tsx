"use client";

import { useState } from "react";
import { 
  Cpu, 
  TrendingUp, 
  Smartphone, 
  ShieldAlert, 
  Scale, 
  Sparkles, 
  Layers, 
  Check 
} from "lucide-react";
import { useAdPreferences } from "./AdPreferencesContext";

interface CategoryDeskBannerProps {
  title: string;
  description?: string | null;
  slug?: string;
  onFilterChange?: (filter: "latest" | "top" | "most_read") => void;
}

const CATEGORY_ICON_MAP: Record<string, any> = {
  "ai-robotics": Cpu,
  "startups-vc": TrendingUp,
  "gadgets-hardware": Smartphone,
  "cybersecurity": ShieldAlert,
  "policy-big-tech": Scale,
  "tech": Sparkles,
};

export function CategoryDeskBanner({
  title,
  description,
  slug,
  onFilterChange,
}: CategoryDeskBannerProps) {
  const { isAdFree } = useAdPreferences();
  const [activeFilter, setActiveFilter] = useState<"latest" | "top" | "most_read">("latest");
  const [isFollowing, setIsFollowing] = useState(false);

  const IconComponent = (slug && CATEGORY_ICON_MAP[slug]) || Layers;

  const handleFilterClick = (filter: "latest" | "top" | "most_read") => {
    setActiveFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  return (
    <div className={`space-y-3.5 transition-all duration-200 ${isAdFree ? "max-w-[840px]" : "max-w-full"}`}>
      {/* Editorial Banner Card - Sleek, properly sized */}
      <div className="relative rounded-2xl border border-[#EBE8DF] dark:border-[#2C2A26] bg-white dark:bg-[#1C1B19] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
        {/* Left Side: Icon & Details */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FAF7F0] dark:bg-[#282723] border border-[#EBE8DF] dark:border-[#383630] flex items-center justify-center text-[#C96442] shadow-2xs">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1F1E1D] dark:text-[#F5F2EB] truncate">
              {title}
            </h1>
            <p className="text-xs text-[#686660] dark:text-[#A8A59D] line-clamp-1 leading-relaxed">
              {description || "Continuous autonomous synthesis across global frontier sources."}
            </p>
          </div>
        </div>

        {/* Right Side: Follow Desk Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
              isFollowing
                ? "bg-[#C96442] text-white"
                : "border border-[#D6D2C4] dark:border-[#3E3A33] text-[#1F1E1D] dark:text-[#F5F2EB] hover:border-[#C96442] hover:text-[#C96442] dark:hover:border-[#C96442] dark:hover:text-[#C96442]"
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Following</span>
              </>
            ) : (
              <span>Follow desk</span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs: Latest, Top today, Most read */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={() => handleFilterClick("latest")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === "latest"
              ? "bg-[#1F1E1D] dark:bg-[#2E2C28] text-white shadow-xs"
              : "text-[#8E8B82] dark:text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => handleFilterClick("top")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === "top"
              ? "bg-[#1F1E1D] dark:bg-[#2E2C28] text-white shadow-xs"
              : "text-[#8E8B82] dark:text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          Top today
        </button>
        <button
          onClick={() => handleFilterClick("most_read")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFilter === "most_read"
              ? "bg-[#1F1E1D] dark:bg-[#2E2C28] text-white shadow-xs"
              : "text-[#8E8B82] dark:text-[#8E8B82] hover:text-[#1F1E1D] dark:hover:text-[#F5F2EB]"
          }`}
        >
          Most read
        </button>
      </div>
    </div>
  );
}