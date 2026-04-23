import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getBlogPostBySlug } from "@/app/blog/data";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="animate-fade-in">
        <nav className="mb-8">
          <Link href="/blog" className="text-sm font-medium text-black hover:text-slate-600">
            ← back to blog
          </Link>
        </nav>
        <p className="text-slate-600">blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <nav className="mb-8">
        <Link href="/blog" className="text-sm font-medium text-black hover:text-slate-600">
          ← back to blog
        </Link>
      </nav>

      <article>
        <header className="mb-12 border-b border-slate-200 pb-12">
          <time className="block mb-4 text-xs font-mono text-slate-500">{post.date}</time>
          <h1 className="text-4xl font-bold tracking-tight text-black">{post.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-mono text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
