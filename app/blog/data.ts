import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { cache } from "react";

import { BlogPost } from "@/app/models/types";

const blogDirectory = path.join(process.cwd(), "content/blog");

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = await fs.promises.readdir(blogDirectory);
  const postsPromises = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = await fs.promises.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const stats = await fs.promises.stat(fullPath);

      let postDate = data.date;
      if (!postDate) {
        const dateMatch = slug.match(/(\d{4})(\d{2})(\d{2})$/);
        if (dateMatch) {
          postDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
        } else {
          postDate = stats.birthtime.toISOString().split("T")[0];
        }
      }

      return {
        id: data.id || 0,
        title: data.title,
        slug,
        date: postDate,
        description: data.description,
        content,
        tags: data.tags || [],
      } as BlogPost;
    });

  const allPostsData = await Promise.all(postsPromises);
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
});

export const getUniqueTags = cache(async (): Promise<string[]> => {
  const posts = await getBlogPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
});
