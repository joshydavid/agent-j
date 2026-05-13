"use client";

import { BlogPost } from "@/app/models/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import FilterPills from "./FilterPills";

interface BlogClientProps {
  allPosts: BlogPost[];
  allTags: string[];
}

function BlogListContent({ allPosts, allTags }: BlogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTags = useMemo(() => {
    const tags = new Set<string>();
    const mainTag = searchParams.get("tag");
    if (mainTag) tags.add(mainTag);

    for (const key of searchParams.keys()) {
      if (key !== "tag" && allTags.includes(key)) {
        tags.add(key);
      }
    }
    return Array.from(tags);
  }, [searchParams, allTags]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      return activeTags.length === 0 || activeTags.some((t) => post.tags.includes(t));
    });
  }, [allPosts, activeTags]);

  return (
    <>
      <FilterPills tags={allTags} activeTags={activeTags} />

      <section aria-live="polite">
        {filteredPosts.length > 0 ? (
          <ul className="flex flex-col gap-8">
            {filteredPosts.map((post) => (
              <li
                key={post.slug}
                className="group border-b border-slate-200 pb-12 transition-colors last:border-0 hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <time className="block text-xs font-mono text-slate-500">{post.date}</time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-2xl font-semibold text-black transition-colors hover:text-slate-600 rounded-sm focus-visible:outline-none focus-visible:underline focus-visible:decoration-slate-400"
                  >
                    {post.title}
                  </Link>
                </div>
                <p className="mt-3 text-base leading-7 text-slate-600">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-mono text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-600 font-medium">no blog posts found for the selected filters.</p>
            <button
              onClick={() => router.replace(window.location.pathname, { scroll: false })}
              className="mt-4 text-[13px] font-medium text-slate-500 hover:text-black underline underline-offset-4 decoration-slate-200"
            >
              clear all filters
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
