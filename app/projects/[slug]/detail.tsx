import Link from "next/link";

import { projects } from "@/app/projects/data";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="animate-fade-in">
        <nav className="mb-8">
          <Link
            href="/projects"
            className="text-sm font-medium text-black hover:text-slate-600 dark:text-white dark:hover:text-slate-400"
          >
            ← back to projects
          </Link>
        </nav>
        <p className="text-slate-600 dark:text-slate-400">project not found.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <nav className="mb-8">
        <Link
          href="/projects"
          className="text-sm font-medium text-black hover:text-slate-600 dark:text-white dark:hover:text-slate-400"
        >
          ← back to projects
        </Link>
      </nav>

      <article>
        <header className="mb-12 border-b border-slate-200 pb-12">
          <time className="block mb-4 text-xs font-mono text-slate-500 dark:text-slate-500">
            {project.tags.find((t) => typeof t === "number")}
          </time>
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">{project.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags
              .filter((t) => typeof t !== "number")
              .map((tag) => (
                <span
                  key={`${tag}`}
                  className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
                >
                  {typeof tag === "number" ? tag : tag.replace(/-/g, " ")}
                </span>
              ))}
          </div>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="lead text-lg leading-7 text-slate-600 dark:text-slate-400">{project.description}</p>

          {project.features && project.features.length > 0 && (
            <section className="my-8">
              <h2 className="text-2xl font-semibold text-black dark:text-white">features</h2>
              <ul className="mt-4 list-disc pl-6 text-base leading-7 text-slate-600 dark:text-slate-400">
                {project.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="my-8">
            <h2 className="text-2xl font-semibold text-black dark:text-white">tech stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border list-none  border-slate-200 px-3 py-1 text-sm dark:border-slate-700"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          {(project.deployedLink || project.gitHub) && (
            <section className="my-8">
              <h2 className="text-2xl font-semibold text-black dark:text-white">links</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {project.deployedLink && (
                  <li>
                    <a
                      href={project.deployedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-black hover:underline dark:text-white"
                    >
                      view project →
                    </a>
                  </li>
                )}
                {project.gitHub && (
                  <li>
                    <a
                      href={project.gitHub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-black hover:underline dark:text-white"
                    >
                      source code →
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
