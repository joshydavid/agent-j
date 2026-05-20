import { getBlogPosts } from "@/app/blog/data";

import BlogDetailPage from "./detail";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default BlogDetailPage;
