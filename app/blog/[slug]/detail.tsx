import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getBlogPostBySlug } from "@/app/blog/data";
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
        className="premium-sliding-link"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
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

  const tocItems = parseToc(post.content);

  return (
    <div className="animate-fade-in">
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
            <ul className="flex flex-col gap-y-2">
              {tocItems.map((item) => (
                <li
                  key={item.slug}
                  style={{ paddingLeft: item.level === 3 ? "1rem" : "0" }}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="text-slate-300 font-mono text-[10px] select-none">
                    {item.level === 3 ? "↳" : "•"}
                  </span>
                  <a
                    href={`#${item.slug}`}
                    className="text-slate-600 hover:text-black transition-colors duration-200 underline-offset-4 hover:underline"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          <ReactMarkdown components={customMarkdownComponents} remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
