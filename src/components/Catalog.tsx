"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { bloggers, type Blogger } from "@/data/mockData";
import BloggerCard from "./BloggerCard";
import { cn } from "@/lib/utils";

// ── Animation Variants ────────────────────────────────────────────

const catalogVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      staggerChildren: 0.18,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.24,
      delayChildren: 0.12,
      duration: 0.9,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const revealVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

const carouselRevealVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 30,
    transition: { duration: 0.9, ease: "easeInOut" },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeInOut" },
  },
};

// ── Props ─────────────────────────────────────────────────────────

interface CatalogProps {
  onSelectBlogger: (blogger: Blogger) => void;
}

// ── Component ─────────────────────────────────────────────────────

export default function Catalog({ onSelectBlogger }: CatalogProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleDragEnd(offsetX: number, velocityX: number) {
    const shouldAdvance = offsetX < -60 || velocityX < -500;
    const shouldGoBack = offsetX > 60 || velocityX > 500;

    if (shouldAdvance) {
      setActiveIndex((index) => (index + 1) % bloggers.length);
    } else if (shouldGoBack) {
      setActiveIndex((index) => (index - 1 + bloggers.length) % bloggers.length);
    }
  }

  function getCardPosition(index: number) {
    let relativeIndex = index - activeIndex;
    const midpoint = bloggers.length / 2;

    if (relativeIndex > midpoint) relativeIndex -= bloggers.length;
    if (relativeIndex < -midpoint) relativeIndex += bloggers.length;

    if (relativeIndex === 0) {
      return { x: "0%", scale: 1, opacity: 1, zIndex: 30, filterClass: "blur-0" };
    }

    if (relativeIndex === -1) {
      return { x: "-65%", scale: 0.85, opacity: 0.6, zIndex: 20, filterClass: "blur-sm" };
    }

    if (relativeIndex === 1) {
      return { x: "65%", scale: 0.85, opacity: 0.6, zIndex: 20, filterClass: "blur-sm" };
    }

    return {
      x: relativeIndex < 0 ? "-110%" : "110%",
      scale: 0.7,
      opacity: 0,
      zIndex: 10,
      filterClass: "blur",
    };
  }

  return (
    <section
      id="catalog"
      className={cn(
        "relative px-5 pt-4",
        "sm:px-8",
        "lg:px-12",
      )}
    >
      <motion.div
        className="pb-24 sm:pb-32"
        variants={catalogVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.05 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        {/* ── Section Header ──────────────────────────────────── */}
        <motion.div
          className="mb-10 text-center sm:mb-14"
          variants={revealVariants}
        >
          <motion.div
            className="mb-3 flex items-center justify-center gap-2"
            variants={revealVariants}
          >
            <LayoutGrid className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Наші автори
            </span>
          </motion.div>

          <motion.h2
            className={cn(
              "font-bold tracking-tight text-zinc-50",
              "text-3xl leading-tight",
              "sm:text-4xl",
              "lg:text-5xl",
            )}
            variants={revealVariants}
          >
            Знайомся з{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              командою
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base"
            variants={revealVariants}
          >
            Натисни на картку, щоб переглянути повний профіль, публікації та статистику автора.
          </motion.p>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
          />
        </motion.div>

        {/* ── Mobile coverflow carousel ───────────────────────── */}
        <motion.div
          className="relative mx-auto h-[calc(127.5vw+4.5rem)] min-h-[500px] w-full md:hidden"
          variants={carouselRevealVariants}
        >
        {bloggers.map((blogger, index) => {
          const cardPosition = getCardPosition(index);

          return (
            <motion.div
              key={blogger.id}
              className={cn(
                "absolute inset-x-0 top-0 mx-auto w-[85vw] max-w-md touch-pan-y",
                cardPosition.filterClass,
              )}
              animate={{
                x: cardPosition.x,
                scale: cardPosition.scale,
                opacity: cardPosition.opacity,
                zIndex: cardPosition.zIndex,
              }}
              style={{
                pointerEvents: index === activeIndex ? "auto" : "none",
              }}
              aria-hidden={index !== activeIndex}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => handleDragEnd(info.offset.x, info.velocity.x)}
            >
              <BloggerCard
                blogger={blogger}
                index={index}
                onClick={onSelectBlogger}
                enableTilt={false}
              />
            </motion.div>
          );
        })}
        </motion.div>

        {/* ── Desktop grid ─────────────────────────────────────── */}
        <motion.div
          className="mx-auto hidden max-w-5xl grid-cols-2 gap-6 md:grid lg:max-w-6xl lg:gap-8"
          variants={carouselRevealVariants}
        >
        {bloggers.map((blogger, index) => (
          <BloggerCard
            key={blogger.id}
            blogger={blogger}
            index={index}
            onClick={onSelectBlogger}
            enableTilt
          />
        ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
