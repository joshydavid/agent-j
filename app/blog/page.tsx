import { getBlogPosts, getUniqueTags } from "@/app/blog/data";
import BlogClient from "./BlogClient";
import ScrollToTop from "@/app/components/ScrollToTop";

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const allTags = await getUniqueTags();

  return (
    <div className="animate-fade-in">
      <ScrollToTop />
      <section className="mb-6 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">blog</h1>
        <p className="mt-2 text-lg leading-7 text-slate-600">sharing my learnings</p>
      </section>

      <BlogClient allPosts={allPosts} allTags={allTags} />
    </div>
  );
}
