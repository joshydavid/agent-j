import { getProjects } from "@/app/projects/data";
import ProjectDetailPage from "./detail";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default ProjectDetailPage;
