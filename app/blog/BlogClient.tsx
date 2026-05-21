"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useTransition } from "react";
import { HiX } from "react-icons/hi";

import { BlogPost } from "@/app/models/types";

interface BlogClientProps {
  allPosts: BlogPost[];
  allTags: string[];
}

function BlogListContent({ allPosts, allTags }: BlogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTags = useMemo(() => {
    const tags = new Set<string>();
    const mainTag = searchParams.get("tag")?.toLowerCase();
    if (mainTag) tags.add(mainTag);

    for (const key of searchParams.keys()) {
      const lowerKey = key.toLowerCase();
      if (lowerKey !== "tag" && allTags.includes(lowerKey)) {
        tags.add(lowerKey);
      }
    }
    return Array.from(tags);
  }, [searchParams, allTags]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      return activeTags.length === 0 || activeTags.some((t) => post.tags.includes(t));
    });
  }, [allPosts, activeTags]);

  const handleTagToggle = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentActive = new Set(activeTags);

      if (currentActive.has(tag)) {
        currentActive.delete(tag);
      } else {
        currentActive.add(tag);
      }

      params.delete("tag");
      allTags.forEach((t) => params.delete(t));

      const tagList = Array.from(currentActive);
      if (tagList.length > 0) {
        params.set("tag", tagList[0]);
        tagList.slice(1).forEach((t) => params.set(t, ""));
      }

      const queryString = params.toString().replace(/=&/g, "&").replace(/=$/, "");

      startTransition(() => {
        router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
      });
    },
    [activeTags, allTags, pathname, router, searchParams],
  );

  const clearFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <>
      {/* Ultra-Minimalist Category Filter Section */}
      <div className="mb-16">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {allTags.map((tag) => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-1.5 text-[11px] font-medium rounded-full transition-[background-color,color,border-color] duration-200 lowercase cursor-pointer border ${
                  isActive
                    ? "bg-slate-100 text-black border-transparent"
                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-black"
                }`}
              >
                {tag}
              </button>
            );
          })}

          {activeTags.length > 0 && (
            <button
              onClick={clearFilters}
              disabled={isPending}
              aria-label="clear all filters"
              className="px-3.5 py-1.5 text-[11px] font-medium rounded-full border border-dashed border-slate-300 bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              <HiX className="w-3.5 h-3.5" />
              <span>clear filters</span>
            </button>
          )}
        </div>
      </div>

      <section aria-live="polite">
        {filteredPosts.length > 0 ? (
          <ul className="flex flex-col gap-8">
            {filteredPosts.map((post) => (
              <li
                key={post.slug}
                className="group border-b border-slate-200 pb-12 transition-colors last:border-0 hover:border-slate-300"
              >
                <div className="flex flex-col flex-wrap sm:flex-row sm:items-center gap-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-2xl font-semibold text-black transition-colors hover:text-slate-600 rounded-sm focus-visible:outline-none focus-visible:underline focus-visible:decoration-slate-400"
                  >
                    {post.title}
                  </Link>
                  <time className="translate-y-[1.5px] block text-[11px] font-mono text-slate-500">
                    {post.date} <span className="mx-1.5">•</span> {post.readingTime}
                  </time>
                </div>
                <p className="mt-3 text-base leading-7 text-slate-600">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`text-[11px] font-mono lowercase transition-colors hover:text-black cursor-pointer ${
                        activeTags.includes(tag) ? "text-black font-semibold" : "text-slate-400"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-600 font-medium">No blog posts found for the selected filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default function BlogClient(props: BlogClientProps) {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-busy="true"
          aria-label="loading blog posts"
          className="mb-12 h-24 animate-pulse bg-slate-50 rounded-lg"
        />
      }
    >
      <BlogListContent {...props} />
    </Suspense>
  );
}
