import Link from "next/link";

import { getBlogPosts } from "@/app/blog/data";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="animate-fade-in">
      <section className="mb-16 border-b border-slate-200 pb-12">
        <h1 className="text-4xl font-bold tracking-tight text-black">blog</h1>
        <p className="mt-2 text-lg leading-7 text-slate-600">sharing my thoughts and learnings</p>
      </section>

      <section>
        <ul className="flex flex-col gap-8">
          {posts.map((post) => (
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
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
          {posts.length === 0 && <p className="text-slate-600">no blog posts yet.</p>}
        </ul>
      </section>
    </div>
  );
}
