import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getBlogPostBySlug, getBlogPosts } from "@/app/blog/data";
import ActiveToc from "@/app/components/ActiveToc";
import CodeBlock from "@/app/components/CodeBlock";
import Mermaid from "@/app/components/Mermaid";
import ReadingProgressBar from "@/app/components/ReadingProgressBar";
import ScrollToTop from "@/app/components/ScrollToTop";

interface TocItem {
  text: string;
  level: number;
  slug: string;
}

function parseToc(content: string): TocItem[] {
  const lines = content.split("\n");
  const items: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      let text = match[2].trim();

      // Strip basic markdown formatting
      text = text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // link text
        .replace(/[*_`]/g, ""); // bold/italic/code

      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      items.push({ text, level, slug });
    }
  }

  return items;
}

const customMarkdownComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string" || typeof child === "number") return String(child);
        if (child && typeof child === "object" && "props" in child) {
          const reactEl = child as React.ReactElement<{ children?: React.ReactNode }>;
          return typeof reactEl.props?.children === "string" ? reactEl.props.children : "";
        }
        return "";
      })
      .join("")
      .trim();

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    return (
      <h2 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = React.Children.toArray(children)
      .map((child) => {
        if (typeof child === "string" || typeof child === "number") return String(child);
        if (child && typeof child === "object" && "props" in child) {
          const reactEl = child as React.ReactElement<{ children?: React.ReactNode }>;
          return typeof reactEl.props?.children === "string" ? reactEl.props.children : "";
        }
        return "";
      })
      .join("")
      .trim();

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    return (
      <h3 id={id} className="scroll-mt-20" {...props}>
        {children}
      </h3>
    );
  },
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        className="premium-sliding-link text-slate-600 hover:text-black transition-colors duration-200 underline-offset-4 hover:underline"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => {
    return (
      <blockquote
        className="my-6 border-l-4 border-slate-900 bg-slate-50/50 py-3 pl-5 pr-4 italic rounded-r-xl text-slate-700 font-serif text-base"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return (
      <span className="block my-8 select-none">
        <span className="relative block overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
            {...props}
          />
        </span>
        {alt && (
          <span className="block mt-3 text-center text-xs font-mono text-slate-400 lowercase">
            {alt}
          </span>
        )}
      </span>
    );
  },
  pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
    return <>{children}</>;
  },
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const match = /language-(\w+)/.exec(className || "");
    const value = String(children).replace(/\n$/, "");
    if (match && match[1] === "mermaid") {
      return <Mermaid value={value} />;
    }
    return match ? (
      <CodeBlock language={match[1]} value={value} />
    ) : (
      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="animate-fade-in">
        <nav className="mb-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-black hover:text-slate-600 rounded-sm focus-visible:outline-none focus-visible:underline focus-visible:decoration-slate-400"
          >
            ← back to blog
          </Link>
        </nav>
        <p className="text-slate-600">blog post not found.</p>
      </div>
    );
  }

  const allPosts = await getBlogPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  const tocItems = parseToc(post.content);

  return (
    <div className="animate-fade-in">
      <ReadingProgressBar />
      <ScrollToTop />
      <nav className="mb-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-black hover:text-slate-600 rounded-sm focus-visible:outline-none focus-visible:underline focus-visible:decoration-slate-400"
        >
          ← back to blog
        </Link>
      </nav>

      <article>
        <header className="mb-12 border-b border-slate-200 pb-12 flex flex-col gap-4">
          <time className="translate-y-px block text-[11px] font-mono text-slate-500">
            {post.date} <span className="mx-1.5">•</span> {post.readingTime}
          </time>
          <h1 className="text-4xl font-bold tracking-tight text-black">{post.title}</h1>
          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-mono text-slate-400 lowercase">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {tocItems.length >= 2 && (
          <div className="mb-10 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200/80 hover:bg-slate-50 transition-all duration-300">
            <h2 className="mb-4 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">on this page</h2>
            <ActiveToc items={tocItems} />
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          <ReactMarkdown components={customMarkdownComponents} remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Bottom Post Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h3 className="mb-6 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">continue reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono text-slate-450 uppercase tracking-wider block mb-2">← older post</span>
                    <h4 className="text-base font-semibold text-black group-hover:text-slate-700 transition-colors line-clamp-2">
                      {prevPost.title}
                    </h4>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 font-light">
                    {prevPost.description}
                  </p>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
              
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-between text-right"
                >
                  <div>
                    <span className="text-[11px] font-mono text-slate-450 uppercase tracking-wider block mb-2">newer post →</span>
                    <h4 className="text-base font-semibold text-black group-hover:text-slate-700 transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 font-light">
                    {nextPost.description}
                  </p>
                </Link>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
