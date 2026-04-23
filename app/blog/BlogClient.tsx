"use client";

import { BlogPost } from "@/app/models/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import FilterPills from "./FilterPills";

interface BlogClientProps {
  allPosts: BlogPost[];
  allTags: string[];
}

function BlogListContent({ allPosts, allTags }: BlogClientProps) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());
  const mainTag = params.get("tag");
  const activeTagsSet = new Set<string>();

  if (mainTag) activeTagsSet.add(mainTag);

  Object.keys(Object.fromEntries(params.entries())).forEach((key) => {
    if (key !== "tag" && allTags.includes(key)) {
      activeTagsSet.add(key);
    }
  });

  const activeTags = Array.from(activeTagsSet);

  const filteredPosts = allPosts.filter((post) => {
    return activeTags.length === 0 || activeTags.some((t) => post.tags.includes(t));
  });

  return (
    <>
      <FilterPills tags={allTags} activeTags={activeTags} />

      <section>
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
                  className="text-2xl font-semibold text-black transition-colors hover:text-slate-600"
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
          {filteredPosts.length === 0 && (
            <p className="text-slate-600">no blog posts found for the selected filters.</p>
          )}
        </ul>
      </section>
    </>
  );
}

export default function BlogClient(props: BlogClientProps) {
  return (
    <Suspense fallback={<div className="mb-12 h-24 animate-pulse bg-slate-50 rounded-lg" />}>
      <BlogListContent {...props} />
    </Suspense>
  );
}
