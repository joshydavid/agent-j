"use client";

import { motion, useScroll } from "framer-motion";

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed top-0 left-0 w-full h-0.75 bg-slate-100/55 z-50 pointer-events-none">
      <motion.div
        className="h-full bg-linear-to-r from-slate-400 to-slate-950 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
