import Link from "next/link";

import { projects } from "@/app/projects/data";

export default function ProjectsPage() {
  return (
    <div className="animate-fade-in">
      <section className="mb-12 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-black">projects</h1>
        <p className="mt-2 text-lg leading-7 text-slate-600">work i&apos;ve done over the years</p>
      </section>

      <section>
        <ul className="flex flex-col gap-8">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="group border-b border-slate-200 pb-12 transition-colors last:border-0 hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <time className="block text-xs font-mono text-slate-500">
                  {project.tags.find((t) => typeof t === "number")}
                </time>
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-2xl font-semibold text-black transition-colors hover:text-slate-600"
                >
                  {project.name}
                </Link>
              </div>
              <p className="mt-3 text-base leading-7 text-slate-600">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags
                  .filter((t) => typeof t !== "number")
                  .map((tag) => (
                    <span
                      key={`${tag}`}
                      className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {typeof tag === "string" ? tag.replace(/-/g, " ") : tag}
                    </span>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
