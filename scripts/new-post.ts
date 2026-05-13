import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const title = process.argv[2];
const category = process.argv[3] || "engineering";

if (!title) {
  console.error("❌ please provide a title: bun run new:blog \"my new post\" [category]");
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
const dateTimeStr = localDate.toISOString();
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
updatedAt: "${dateTimeStr}"
description: "A short summary of what this post is about."
category: "${category.toLowerCase()}"
tags: []
author: "Joshua David"
---

## Introduction

Start writing your introduction here. Why is this topic important?

## The Problem

What challenge are you addressing?

## The Solution

How did you solve it? Include code snippets if relevant.

\`\`\`typescript
// Example code
const greeting = "Hello, Portfolio!";
console.log(greeting);
\`\`\`

## Conclusion

Summarize the key takeaways.
`;

writeFileSync(fullPath, template);

console.log(`✅ created new blog post: ${fileName}`);
console.log(`📍 location: content/blog/${fileName}`);
console.log(`🏷️  category: ${category}`);
