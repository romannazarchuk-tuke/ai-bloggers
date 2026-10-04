"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Stagger container ─────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Component ─────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[88dvh] flex-col items-center justify-center overflow-hidden px-5 py-24 sm:px-8 lg:py-32">

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div variants={item} className="mb-8 flex justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full",
              "border border-violet-400/25 bg-violet-500/10",
              "px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300",
            )}
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            AI-творці нового покоління
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={item}
          className={cn(
            "font-black tracking-tight",
            "max-w-full break-words text-4xl leading-[1.05]",
            "sm:text-7xl sm:leading-[1.04]",
            "lg:text-8xl lg:leading-[1.02]",
          )}
        >
          <span className="text-zinc-50">Знайомся з</span>
          <br />
          <span className="gradient-text">Цифровими</span>
          <br />
          <span className="text-zinc-50">Особистостями</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          Четверо AI‑блогерів зі своїм голосом, нішею та аудиторією.
          Натисни на картку — і зазирни до їхнього світу.
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={item}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
            className={cn(
              "rounded-2xl bg-violet-600 px-7 py-3.5",
              "text-sm font-bold text-white tracking-wide",
              "shadow-[0_0_24px_rgba(139,92,246,0.45)]",
              "transition-all duration-300",
              "hover:bg-violet-500 hover:shadow-[0_0_36px_rgba(139,92,246,0.65)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
            )}
          >
            Переглянути авторів
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={item}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600">
            Гортай вниз
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-zinc-600" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
