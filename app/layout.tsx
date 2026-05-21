import "./globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { getBlogPosts } from "@/app/blog/data";
import GlobalSearch from "@/app/components/GlobalSearch";
import SidebarNav from "@/app/components/SidebarNav";
import { EXTERNAL_LINKS } from "@/app/constants/links";
import { getProjects } from "@/app/projects/data";
import { VercelInsights } from "@/app/providers/VercelInsights";

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

  const blogSearchItems = allPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    type: "blog" as const,
    description: post.description,
  }));

  const projectSearchItems = allProjects.map((project) => ({
    id: project.id,
    title: project.name,
    slug: project.slug,
    type: "project" as const,
    description: project.description,
  }));

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex justify-center bg-white antialiased">
        <GlobalSearch blogPosts={blogSearchItems} projects={projectSearchItems} />
        <div className="flex flex-col md:flex-row w-full max-w-5xl">
          <SidebarNav />
          <div className="flex-1 min-w-0">
            <main className="max-w-3xl px-8 pt-10 pb-6 md:px-16 md:py-16">{children}</main>
          </div>
        </div>
        <VercelInsights />
      </body>
    </html>
  );
}
