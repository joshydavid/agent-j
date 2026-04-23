"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { HiX } from "react-icons/hi";

interface FilterPillsProps {
  tags: string[];
  activeTags: string[];
}

export default function FilterPills({ tags, activeTags }: FilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleTag = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const mainTag = params.get("tag");

      const otherActiveTags = Array.from(params.keys()).filter((k) => k !== "tag" && tags.includes(k));

      if (mainTag === tag) {
        params.delete("tag");
        if (otherActiveTags.length > 0) {
          const newMain = otherActiveTags[0];
          params.delete(newMain);
          params.set("tag", newMain);
        }
      } else if (otherActiveTags.includes(tag)) {
        params.delete(tag);
      } else {
        if (!mainTag) {
          params.set("tag", tag);
        } else {
          params.set(tag, "");
        }
      }

      return params.toString();
    },
    [searchParams, tags],
  );

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const handleTagClick = (tag: string) => {
    const queryString = toggleTag(tag);
    const cleanQuery = queryString.replace(/=&/g, "&").replace(/=$/, "");
    router.push(`${pathname}${cleanQuery ? `?${cleanQuery}` : ""}`, { scroll: false });
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-16 space-y-1">
      <div className="flex items-center justify-end h-4 mb-4 md:mb-0">
        {activeTags.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 cursor-pointer text-[11px] font-medium text-slate-400 hover:text-black transition-colors underline underline-offset-4 decoration-slate-200"
          >
            <HiX className="w-3 h-3" />
            clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`group flex items-center gap-1.5 cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-slate-800 text-white shadow-md shadow-slate-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
