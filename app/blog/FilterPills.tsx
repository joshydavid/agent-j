"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { HiX } from "react-icons/hi";

interface FilterPillsProps {
  tags: string[];
  activeTags: string[];
}

export default function FilterPills({ tags, activeTags }: FilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const toggleTag = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const activeTags = new Set<string>();

      const mainTag = params.get("tag");
      if (mainTag) activeTags.add(mainTag);
      for (const key of params.keys()) {
        if (key !== "tag" && tags.includes(key)) activeTags.add(key);
      }

      if (activeTags.has(tag)) {
        activeTags.delete(tag);
      } else {
        activeTags.add(tag);
      }

      // Clear existing tag-related params
      params.delete("tag");
      tags.forEach((t) => params.delete(t));

      // Re-add tags in the specific format: ?tag=first&second&third
      const tagList = Array.from(activeTags);
      if (tagList.length > 0) {
        params.set("tag", tagList[0]);
        tagList.slice(1).forEach((t) => params.set(t, ""));
      }

      return params.toString();
    },
    [searchParams, tags],
  );

  const clearFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const handleTagClick = (tag: string) => {
    const queryString = toggleTag(tag);
    const cleanQuery = queryString.replace(/=&/g, "&").replace(/=$/, "");
    startTransition(() => {
      router.replace(`${pathname}${cleanQuery ? `?${cleanQuery}` : ""}`, { scroll: false });
    });
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={`mb-16 space-y-1 transition-opacity duration-200 ${isPending ? "opacity-70" : "opacity-100"}`}>
      <div className="flex items-center justify-end h-4 mb-4 md:mb-0">
        {activeTags.length > 0 && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            aria-label="clear all filters"
            className="flex items-center gap-1 cursor-pointer text-[11px] font-medium text-slate-400 hover:text-black focus-visible:text-black active:opacity-50 transition-all underline underline-offset-4 decoration-slate-200 disabled:cursor-not-allowed rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
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
              disabled={isPending}
              aria-pressed={isActive}
              className={`group flex items-center gap-1.5 cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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
