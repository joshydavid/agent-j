import { projects } from "@/app/projects/data";
import ProjectDetailPage from "./detail";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default ProjectDetailPage;
