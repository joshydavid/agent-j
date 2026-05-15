import Link from "next/link";

import { getProjectBySlug } from "@/app/projects/data";
import ScrollToTop from "@/app/components/ScrollToTop";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="animate-fade-in">
        <nav className="mb-8">
          <Link
            href="/projects"
            className="text-sm font-medium text-black hover:text-slate-600 rounded-sm focus-visible:outline-none focus-visible:underline focus-visible:decoration-slate-400"
          >
            ← back to projects
          </Link>
        </nav>
        <p className="text-slate-600">project not found.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ScrollToTop />
      <nav className="mb-8">
        <Link
          href="/projects"
          className="text-sm font-medium text-black hover:text-slate-600 rounded-sm focus-visible:outline-none focus-visible:underline focus-visible:decoration-slate-400"
        >
          ← back to projects
        </Link>
      </nav>

      <article>
        <header className="mb-8 border-b border-slate-200 pb-8">
          {project.awards && project.awards.length > 0 && (
            <div className="mb-4 flex text-[11px] items-center gap-2">
              <span role="img" aria-label="award">🏆</span>
              <span className="font-semibold tracking-[0.15em] uppercase text-blue-500">{project.awards[0]}</span>
            </div>
          )}

          <time className="block mb-2 text-xs font-mono text-slate-500">
            {project.tags.find((t) => typeof t === "number")}
          </time>
          <h1 className="text-4xl font-bold tracking-tight text-black">{project.name}</h1>
          <div className="mt-3 flex flex-wrap gap-3">
            {project.tags
              .filter((t) => typeof t !== "number")
              .map((tag) => (
                <span key={`${tag}`} className="text-[11px] font-mono text-slate-400">
                  #{tag}
                </span>
              ))}
          </div>
        </header>

        <div className="prose prose-slate max-w-none">
          <p className="text-base leading-7 text-slate-600">{project.description}</p>

          {project.features && project.features.length > 0 && (
            <section className="my-8">
              <h2 className="text-2xl font-semibold text-black">features</h2>
              <ul className="mt-4 list-disc pl-6 text-base leading-7 text-slate-600">
                {project.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="my-8">
            <h2 className="text-2xl font-semibold text-black">tech stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <div key={tech} className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] text-slate-600">
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {(project.deployedLink || project.gitHub) && (
            <section className="my-8">
              <h2 className="text-2xl font-semibold text-black">links</h2>
              <ul className="mt-4 not-prose flex flex-col">
                {project.deployedLink && (
                  <li>
                    <a
                      href={project.deployedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-black hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
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
                      className="inline-flex items-center text-sm font-medium text-black hover:underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
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
