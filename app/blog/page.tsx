import { getBlogPosts, getUniqueTags } from "@/app/blog/data";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
  const allPosts = getBlogPosts();
  const allTags = getUniqueTags();

  return (
    <div className="animate-fade-in">
      <section className="mb-6 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">blog</h1>
        <p className="mt-2 text-lg leading-7 text-slate-600">sharing my learnings</p>
      </section>

      <BlogClient allPosts={allPosts} allTags={allTags} />
    </div>
  );
}
