"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import {
  HiOutlineArrowRight,
  HiOutlineCode,
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlineHome,
  HiOutlineLink,
  HiSearch,
} from "react-icons/hi";

import { EXTERNAL_LINKS } from "@/app/constants/links";

interface SearchItem {
  id: string | number;
  title: string;
  slug: string;
  type: "blog" | "project";
  description?: string;
}

interface GlobalSearchProps {
  blogPosts: SearchItem[];
  projects: SearchItem[];
}

export function SearchTrigger({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 pl-4 pr-6 mr-12 py-2.5 text-[12px] font-medium text-slate-500 bg-white border border-slate-200 rounded-md hover:border-slate-400 hover:text-black transition-[colors,border-color,box-shadow] duration-150 cursor-pointer focus-visible:!outline-none focus-visible:!ring-1 focus-visible:!ring-slate-400 group shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <HiSearch className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
        <span className="tracking-tight uppercase font-mono text-[10px] text-slate-400 group-hover:text-slate-600 leading-none transition-colors">
          search
        </span>
      </div>

      <div className="flex items-center gap-1.5 pl-4 border-l border-slate-100">
        <kbd className="flex items-center justify-center gap-1 font-mono text-[11px] text-slate-400 group-hover:text-black leading-none transition-colors">
          <span className="text-[12px] h-3.5 flex items-center justify-center">⌘</span>
          <span className="h-3.5 flex items-center justify-center">K</span>
        </kbd>
      </div>
    </button>
  );
}

const RECENT_ITEMS_KEY = "global-search-recent";

export default function GlobalSearch({ blogPosts, projects }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [recentItems, setRecentItems] = useState<SearchItem[]>([]);
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  // Handle scroll to hide/show search trigger
  useEffect(() => {
    const controlSearchTrigger = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up or at top
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlSearchTrigger);
    return () => {
      window.removeEventListener("scroll", controlSearchTrigger);
    };
  }, [lastScrollY]);

  // Load recent items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_ITEMS_KEY);
    if (saved) {
      try {
        const items = JSON.parse(saved);
        setTimeout(() => setRecentItems(items), 0);
      } catch (e) {
        console.error("Failed to parse recent search items", e);
      }
    }
  }, []);

  // Toggle the menu when ⌘K is pressed or via custom event
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) setSearch(""); // Clear search when opening
          return next;
        });
      }
    };

    const openSearch = () => {
      setOpen(true);
      setSearch("");
    };

    document.addEventListener("keydown", down);
    window.addEventListener("open-global-search", openSearch);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-global-search", openSearch);
    };
  }, []);

  const onSelect = (item: SearchItem) => {
    // Add to recent items
    const updatedRecent = [item, ...recentItems.filter((i) => i.id !== item.id || i.type !== item.type)].slice(0, 5);

    setRecentItems(updatedRecent);
    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(updatedRecent));

    setOpen(false);
    setSearch("");
    if (item.type === "blog") {
      router.push(`/blog/${item.slug}`);
    } else {
      router.push(`/projects/${item.slug}`);
    }
  };

  const onAction = (url: string, isExternal = false) => {
    setOpen(false);
    setSearch("");
    if (isExternal) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  return (
    <>
      <SearchTrigger
        onClick={() => setOpen(true)}
        className={`fixed top-6 right-16 z-40 hidden md:flex transition-[opacity,transform] duration-300 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      />

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Search"
        className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4 sm:px-6 focus-visible:!outline-none"
      >
        <VisuallyHidden.Root>
          <Dialog.Title>global search</Dialog.Title>
          <Dialog.Description>search for blog posts and projects across the site.</Dialog.Description>
        </VisuallyHidden.Root>

        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        />

        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 focus-visible:!outline-none pointer-events-auto">
          <div className="flex items-center px-4 border-b border-slate-100">
            <HiSearch className="w-5 h-5 text-slate-400" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="search or type a command…"
              className="flex-1 h-12 px-3 text-sm outline-none !outline-none focus-visible:!outline-none placeholder:text-slate-400"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2 scroll-smooth overscroll-contain">
            <Command.Empty className="py-12 text-center">
              <p className="text-sm text-slate-500">no results found.</p>
            </Command.Empty>

            {recentItems.length > 0 && (
              <Command.Group
                heading="recent"
                className="px-2 py-1.5 text-[11px] font-medium text-slate-400 tracking-wider"
              >
                {recentItems.map((item) => (
                  <Command.Item
                    key={`recent-${item.type}-${item.id}`}
                    value={`${item.title} recent ${item.type}`}
                    onSelect={() => onSelect(item)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
                  >
                    {item.type === "blog" ? (
                      <HiOutlineDocumentText className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                    ) : (
                      <HiOutlineFolder className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                    )}
                    <span className="flex-1">{item.title}</span>
                    <span className="text-[10px] text-slate-300 group-aria-selected:text-slate-400 uppercase font-mono">
                      {item.type}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group
              heading="quick actions"
              className="px-2 py-1.5 text-[11px] font-medium text-slate-400 tracking-wider"
            >
              <Command.Item
                onSelect={() => onAction("/")}
                value="go to home page navigation index"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
              >
                <HiOutlineHome className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                <span>go to home</span>
                <HiOutlineArrowRight className="ml-auto w-3 h-3 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
              </Command.Item>
              <Command.Item
                onSelect={() => onAction("/projects")}
                value="view all projects work portfolio code navigation"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
              >
                <HiOutlineCode className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                <span>view all projects</span>
                <HiOutlineArrowRight className="ml-auto w-3 h-3 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
              </Command.Item>
              <Command.Item
                onSelect={() => onAction("/blog")}
                value="read blog posts articles writeups writing navigation"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
              >
                <HiOutlineDocumentText className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                <span>read blog posts</span>
                <HiOutlineArrowRight className="ml-auto w-3 h-3 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="social"
              className="px-2 py-1.5 text-[11px] font-medium text-slate-400 tracking-wider"
            >
              <Command.Item
                onSelect={() => onAction(EXTERNAL_LINKS.RESUME, true)}
                value="view resume cv pdf document external"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
              >
                <HiOutlineDocumentText className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                <span>view resume</span>
                <HiOutlineLink className="ml-auto w-3 h-3 text-slate-300" />
              </Command.Item>
              <Command.Item
                onSelect={() => onAction(EXTERNAL_LINKS.GITHUB, true)}
                value="github social account code external"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
              >
                <FaGithub className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                <span>github</span>
                <HiOutlineLink className="ml-auto w-3 h-3 text-slate-300" />
              </Command.Item>
              <Command.Item
                onSelect={() => onAction(EXTERNAL_LINKS.LINKEDIN, true)}
                value="linkedin social account networking external"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
              >
                <FaLinkedinIn className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                <span>linkedin</span>
                <HiOutlineLink className="ml-auto w-3 h-3 text-slate-300" />
              </Command.Item>
            </Command.Group>

            {/* Results */}
            {blogPosts.length > 0 && (
              <Command.Group
                heading="blog posts"
                className="px-2 py-1.5 text-[11px] font-medium text-slate-400 tracking-wider"
              >
                {blogPosts.map((post) => (
                  <Command.Item
                    key={`blog-${post.slug}`}
                    value={`${post.title} ${post.description || ""} blog post article writeup`}
                    onSelect={() => onSelect(post)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
                  >
                    <HiOutlineDocumentText className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                    <div className="flex flex-col">
                      <span>{post.title}</span>
                      {post.description && (
                        <span className="text-[11px] text-slate-400 line-clamp-1 group-aria-selected:text-slate-500">
                          {post.description}
                        </span>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {projects.length > 0 && (
              <Command.Group
                heading="projects"
                className="mt-2 px-2 py-1.5 text-[11px] font-medium text-slate-400 tracking-wider"
              >
                {projects.map((project) => (
                  <Command.Item
                    key={`project-${project.slug}`}
                    value={`${project.title} ${project.description || ""} project work portfolio code`}
                    onSelect={() => onSelect(project)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50 hover:text-slate-900 aria-selected:bg-slate-50 aria-selected:text-slate-900 transition-[background-color,color] duration-150 focus-visible:!outline-none group"
                  >
                    <HiOutlineFolder className="w-4 h-4 text-slate-400 group-aria-selected:text-slate-600" />
                    <div className="flex flex-col">
                      <span>{project.title}</span>
                      {project.description && (
                        <span className="text-[11px] text-slate-400 line-clamp-1 group-aria-selected:text-slate-500">
                          {project.description}
                        </span>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            <div className="flex gap-3">
              <span>
                <kbd className="bg-white border px-1 rounded shadow-sm">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="bg-white border px-1 rounded shadow-sm">enter</kbd> select
              </span>
              <span className="hidden sm:inline">
                <kbd className="bg-white border px-1 rounded shadow-sm">esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}
