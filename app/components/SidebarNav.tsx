"use client";

import { BookOpen, Folder, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

import { EXTERNAL_LINKS } from "@/app/constants/links";

export default function SidebarNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      if (scrollY <= 10) {
        setIsVisible(true);
        lastScrollY = scrollY;
        ticking = false;
        return;
      }

      if (Math.abs(scrollY - lastScrollY) > 5) {
        const isScrollingDown = scrollY > lastScrollY;
        setIsVisible(!isScrollingDown);
        lastScrollY = scrollY;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: "/", label: "about", icon: User },
    { href: "/projects", label: "projects", icon: Folder },
    { href: "/blog", label: "blog", icon: BookOpen },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 md:hidden transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="px-8 pt-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <Image
                  src={EXTERNAL_LINKS.PROFILE_PICTURE}
                  alt="Joshua avatar"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover border border-slate-100 group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <a
                href={EXTERNAL_LINKS.GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-950 transition-all duration-200 rounded-lg p-2 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
              </a>
              <a
                href={EXTERNAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-950 transition-all duration-200 rounded-lg p-2 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          <ul className="flex items-center gap-1 pt-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                      active
                        ? "bg-slate-100 text-slate-950 font-semibold shadow-xs"
                        : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={12} className={active ? "text-slate-950" : "text-slate-400"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <header className="hidden md:flex w-64 border-r border-slate-100 shrink-0 sticky top-0 h-screen flex-col bg-white">
        <nav className="px-10 py-12 h-full flex flex-col justify-between">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col items-start gap-4">
              <Link href="/" className="relative inline-block w-fit group">
                <div className="relative p-0.5 rounded-full border border-slate-100 bg-white shadow-xs group-hover:shadow-sm group-hover:border-slate-200 transition-all duration-300">
                  <Image
                    src={EXTERNAL_LINKS.PROFILE_PICTURE}
                    alt="Joshua Ang Profile"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    priority
                  />
                </div>
                <span className="absolute bottom-0 right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white"></span>
                </span>
              </Link>
            </div>
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                        active
                          ? "bg-slate-100 text-slate-950 font-semibold"
                          : "text-slate-500 hover:text-slate-950 hover:bg-slate-50/70"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-slate-950 rounded-r-md" />
                      )}
                      <Icon
                        size={16}
                        className={`transition-colors duration-200 ${active ? "text-slate-950" : "text-slate-400 group-hover:text-slate-600"}`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-5 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 pl-1">
              <a
                href={EXTERNAL_LINKS.GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-950 hover:scale-105 transition-all duration-200 rounded-lg p-1 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
              </a>
              <a
                href={EXTERNAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-950 hover:scale-105 transition-all duration-200 rounded-lg p-1 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
