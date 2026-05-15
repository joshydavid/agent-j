import { EXTERNAL_LINKS } from "@/app/constants/links";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { VercelInsights } from "@/app/providers/VercelInsights";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./globals.css";
import GlobalSearch from "@/app/components/GlobalSearch";
import { getBlogPosts } from "@/app/blog/data";
import { getProjects } from "@/app/projects/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joshua Ang",
  description: "Software Engineer",
  icons: {
    icon: EXTERNAL_LINKS.PROFILE_PICTURE,
    apple: EXTERNAL_LINKS.PROFILE_PICTURE,
  },
  openGraph: {
    title: "Joshua Ang",
    description: "Software Engineer",
    siteName: "Joshua Ang",
    images: [
      {
        url: EXTERNAL_LINKS.OPEN_GRAPH,
        width: 1200,
        height: 630,
        alt: "Joshua Ang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshua Ang",
    description: "Software Engineer",
    images: [EXTERNAL_LINKS.OPEN_GRAPH],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allPosts = await getBlogPosts();
  const allProjects = await getProjects();
  
  const blogSearchItems = allPosts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    type: "blog" as const,
    description: post.description
  }));

  const projectSearchItems = allProjects.map(project => ({
    id: project.id,
    title: project.name,
    slug: project.slug,
    type: "project" as const,
    description: project.description
  }));

  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex justify-center bg-white antialiased">
        <GlobalSearch blogPosts={blogSearchItems} projects={projectSearchItems} />
        
        <div className="flex flex-col md:flex-row w-full max-w-5xl">
          {/* Sidebar / Navigation */}
          <header className="w-full md:w-64 md:border-r md:border-slate-100 shrink-0 md:sticky md:top-0 md:h-screen">
            <nav className="px-8 pt-8 pb-2 md:px-12 md:py-16 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2 md:mb-12">
                <Link href="/" className="inline-block group rounded-full">
                  <Image
                    src={EXTERNAL_LINKS.PROFILE_PICTURE}
                    alt="Joshua"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    priority
                  />
                </Link>
              </div>
              <ul className="flex flex-row md:flex-col gap-6 md:gap-4">
                <li>
                  <Link
                    href="/"
                    className="text-[13px] font-medium text-slate-500 hover:text-black transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    about
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-[13px] font-medium text-slate-500 hover:text-black transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-[13px] font-medium text-slate-500 hover:text-black transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  >
                    blog
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          <div className="flex-1 min-w-0">
            <main className="max-w-3xl px-8 py-4 md:px-16 md:py-16">
              {children}
              <footer className="mt-16 pt-4 border-t border-slate-50">
                <div className="flex gap-4">
                  <a
                    href={EXTERNAL_LINKS.GITHUB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-black transition-all duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    aria-label="GitHub"
                  >
                    <FaGithub size={18} />
                  </a>
                  <a
                    href={EXTERNAL_LINKS.LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-black transition-all duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn size={18} />
                  </a>
                </div>
              </footer>
            </main>
          </div>
        </div>
        <VercelInsights />
      </body>
    </html>
  );
}
