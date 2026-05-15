import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { cache } from "react";

import { Project } from "@/app/models/types";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const fileNames = await fs.promises.readdir(projectsDirectory);
  const projectsPromises = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = await fs.promises.readFile(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        ...data,
        slug: data.slug || slug,
      } as Project;
    });

  const allProjectsData = await Promise.all(projectsPromises);
  return allProjectsData.sort((a, b) => (a.id < b.id ? 1 : -1));
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | undefined> => {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
});
