import { getBlogPosts, getUniqueTags } from "@/app/blog/data";
import Link from "next/link";
import { Suspense } from "react";
import FilterPills from "./FilterPills";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const allPosts = getBlogPosts();
  const allTags = getUniqueTags();

  const mainTag = params.tag;
  const activeTags = new Set<string>();

  if (typeof mainTag === "string") {
    activeTags.add(mainTag);
  } else if (Array.isArray(mainTag)) {
    mainTag.forEach((t) => activeTags.add(t));
  }

  Object.keys(params).forEach((key) => {
    if (key !== "tag" && allTags.includes(key)) {
      activeTags.add(key);
    }
  });

  const activeTagsArray = Array.from(activeTags);

  const filteredPosts = allPosts.filter((post) => {
    const matchesTags = activeTagsArray.length === 0 || activeTagsArray.some((t) => post.tags.includes(t));
    return matchesTags;
  });

  return (
    <div className="animate-fade-in">
      <section className="mb-6 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">blog</h1>
        <p className="mt-2 text-lg leading-7 text-slate-600">sharing my learnings</p>
      </section>

      <Suspense fallback={<div className="mb-12 h-24 animate-pulse bg-slate-50 rounded-lg" />}>
        <FilterPills tags={allTags} activeTags={activeTagsArray} />
      </Suspense>

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
    </div>
  );
}
