import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

import { EXTERNAL_LINKS } from "@/app/constants/links";
import { Providers } from "@/app/providers";

import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="md:h-screen md:overflow-hidden flex items-center justify-center bg-white dark:bg-black p-4 no-scrollbar">
        <Providers>
          <div className="flex flex-col md:flex-row w-full max-w-5xl md:h-[85vh]">
            {/* Sidebar / Navigation */}
            <div className="w-full md:w-64 md:border-r md:border-slate-100 md:dark:border-slate-900 shrink-0">
              <nav className="px-8 pt-8 pb-2 md:px-12 md:py-16">
                <div className="mb-2 md:mb-12">
                  <Link href="/" className="inline-block group">
                    <Image
                      src={EXTERNAL_LINKS.PROFILE_PICTURE}
                      alt="Joshua"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      loading="eager"
                    />
                  </Link>
                </div>
                <ul className="flex flex-row md:flex-col gap-6 md:gap-4">
                  <li>
                    <Link
                      href="/"
                      className="text-[13px] font-medium text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      about
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/projects"
                      className="text-[13px] font-medium text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-[13px] font-medium text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      blog
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex-1 md:overflow-y-auto no-scrollbar">
              <main className="max-w-3xl px-8 py-4 md:px-16 md:py-16">
                {children}
                <footer className="mt-16 pt-4">
                  <div className="flex gap-4">
                    <a
                      href={EXTERNAL_LINKS.GITHUB}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-black dark:text-slate-500 dark:hover:text-white transition-all duration-200"
                      aria-label="GitHub"
                    >
                      <FaGithub size={18} />
                    </a>
                    <a
                      href={EXTERNAL_LINKS.LINKEDIN}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-black dark:text-slate-500 dark:hover:text-white transition-all duration-200"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedinIn size={18} />
                    </a>
                  </div>
                </footer>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
