import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { BlogPost } from "@/app/models/types";

const blogDirectory = path.join(process.cwd(), "content/blog");

export function getBlogPosts(): BlogPost[] {
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

      return {
        id: data.id || 0,
        title: data.title,
        slug,
        date: data.date,
        description: data.description,
        content,
        tags: data.tags || [],
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const fullPath = path.join(blogDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    id: data.id || 0,
    title: data.title,
    slug,
    date: data.date,
    description: data.description,
    content,
    tags: data.tags || [],
  } as BlogPost;
}

export function getUniqueTags(): string[] {
  const posts = getBlogPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
