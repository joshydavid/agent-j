"use client";

import React, { useState } from "react";
import { HiCheck, HiOutlineClipboard } from "react-icons/hi";

interface CodeBlockProps {
  language?: string;
  value: string;
}

export default function CodeBlock({ language = "text", value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="relative my-8 group rounded-xl border border-slate-900 bg-slate-950 shadow-xl overflow-hidden">
      {/* Top macOS-style panel */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800/60 select-none">
        {/* Left: Window controls */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        
        {/* Middle: Language indicator */}
        <span className="text-[11px] font-mono font-medium text-slate-400 lowercase tracking-wider">
          {language}
        </span>

        {/* Right: Copy Button */}
        <button
          onClick={handleCopy}
          aria-label="Copy code block"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 rounded px-1.5 py-0.5 cursor-pointer"
        >
          {copied ? (
            <>
              <HiCheck className="w-3.5 h-3.5 text-emerald-400 animate-fade-in" />
              <span className="text-[11px] text-emerald-400 font-mono font-medium">copied</span>
            </>
          ) : (
            <>
              <HiOutlineClipboard className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono font-medium">copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents panel */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-slate-100/90 whitespace-pre">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
