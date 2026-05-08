import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { BlogPost } from "@/app/models/types";

const blogDirectory = path.join(process.cwd(), "content/blog");

let postsCache: BlogPost[] | null = null;

export function getBlogPosts(): BlogPost[] {
  if (postsCache) {
    return postsCache;
  }

  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const stats = fs.statSync(fullPath);

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

  postsCache = allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  return postsCache;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export function getUniqueTags(): string[] {
  const posts = getBlogPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
