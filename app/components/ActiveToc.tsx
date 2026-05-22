"use client";

import React, { useEffect, useState } from "react";

interface TocItem {
  text: string;
  level: number;
  slug: string;
}

interface ActiveTocProps {
  items: TocItem[];
}

export default function ActiveToc({ items }: ActiveTocProps) {
  const [activeSlug, setActiveSlug] = useState<string>(items[0]?.slug || "");

  useEffect(() => {
    if (items.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -70% 0px", // triggers when heading is in upper region of screen
      threshold: 0.1,
    };

    const headingElements = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSlug(entry.target.id);
        }
      });
    }, observerOptions);

    headingElements.forEach((el) => observer.observe(el));

    // Fallback scrolling checking for edge cases (top and bottom of page)
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Top of page
      if (scrollPosition < 50) {
        setActiveSlug(items[0].slug);
        return;
      }

      // Bottom of page
      if (window.innerHeight + scrollPosition >= document.documentElement.scrollHeight - 100) {
        setActiveSlug(items[items.length - 1].slug);
        return;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  return (
    <ul className="flex flex-col gap-y-2">
      {items.map((item) => {
        const isActive = item.slug === activeSlug;
        return (
          <li
            key={item.slug}
            style={{ paddingLeft: item.level === 3 ? "1rem" : "0" }}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="font-mono text-[10px] select-none text-slate-350"
            >
              {item.level === 3 ? "↳" : "•"}
            </span>
            <a
              href={`#${item.slug}`}
              className={`transition-all duration-300 underline-offset-4 hover:underline text-slate-500 hover:text-black ${
                isActive ? "translate-x-0.5" : ""
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
