import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const title = process.argv[2];

if (!title) {
  console.error("❌ please provide a title: bun run new:blog \"my new post\"");
  process.exit(1);
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const now = new Date();
const offset = now.getTimezoneOffset();
const localDate = new Date(now.getTime() - offset * 60 * 1000);
const dateStr = localDate.toISOString().split("T")[0]; // YYYY-MM-DD
const dateCompact = dateStr.replace(/-/g, ""); // YYYYMMDD

const slug = slugify(title);
const fileName = `${slug}-${dateCompact}.md`;
const blogDirectory = join(process.cwd(), "content/blog");

if (!existsSync(blogDirectory)) {
  mkdirSync(blogDirectory, { recursive: true });
}

const fullPath = join(blogDirectory, fileName);

if (existsSync(fullPath)) {
  console.error(`❌ file already exists: ${fileName}`);
  process.exit(1);
}

const template = `---
title: "${title.toLowerCase()}"
date: "${dateStr}"
description: ""
tags: []
---

start writing here...
`;

writeFileSync(fullPath, template);

console.log(`✅ created new blog post: ${fileName}`);
console.log(`📍 location: content/blog/${fileName}`);
