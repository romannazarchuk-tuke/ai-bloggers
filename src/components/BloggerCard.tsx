"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";
import { cn, formatFollowers } from "@/lib/utils";
import type { Blogger } from "@/data/mockData";

// ── Props ─────────────────────────────────────────────────────────
interface BloggerCardProps {
  blogger: Blogger;
  onClick: (blogger: Blogger) => void;
  index?: number;
  enableTilt?: boolean;
}

// ── Fly-in variant ────────────────────────────────────────────────
// NOTE: only Y movement + scale — NO x translation (prevents h-scroll)
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 24,
      delay: i * 0.09,
    },
  }),
};

// ── 3D Tilt — rotation only, zero translation (scroll-safe) ───────
function use3DTilt() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 250, damping: 22 });
  const y = useSpring(rawY, { stiffness: 250, damping: 22 });
  // Only rotate, never translate → no layout overflow
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }
  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

// ── Component ─────────────────────────────────────────────────────
export default function BloggerCard({ blogger, onClick, index = 0, enableTilt = true }: BloggerCardProps) {
  const { name, niche, nicheColor, nicheGradient, followers, imagePath } = blogger;
  const tilt = use3DTilt();

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial={enableTilt ? "hidden" : false}
      animate={enableTilt ? "visible" : undefined}
      whileTap={enableTilt ? { scale: 0.985 } : undefined}
      className="group relative cursor-pointer"
      style={{ perspective: 900 }}
      onClick={() => onClick(blogger)}
      role="button"
      tabIndex={0}
      aria-label={`Переглянути профіль ${name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(blogger);
        }
      }}
    >
      {/* Hover glow — contained inside article with overflow:hidden on wrapper */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0 rounded-[20px]",
          `bg-gradient-to-br ${nicheGradient}`,
          "opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100",
        )}
      />

      {/* 3D tilt shell — rotates but never translates */}
      <motion.div
        onMouseMove={enableTilt ? tilt.onMouseMove : undefined}
        onMouseLeave={enableTilt ? tilt.onMouseLeave : undefined}
        style={enableTilt ? {
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d",
        } : undefined}
        className={cn(
          "relative z-10 overflow-hidden rounded-[20px]",
          "glass-card",
          "shadow-[0_2px_20px_rgba(0,0,0,0.4)]",
          "transition-shadow duration-300",
          "group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.55)]",
        )}
      >
        {/* ── Portrait ─────────────────────────────────────────── */}
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={imagePath}
            alt={`Портрет ${name}`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            priority={index < 2}
          />

          {/* Deep bottom gradient for text legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 via-[40%] to-transparent"
          />

          {/* Bottom info block */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            {/* Niche chip */}
            <span
              className={cn(
                "mb-3 inline-flex items-center rounded-full",
                "border border-white/10 bg-white/10 backdrop-blur-sm",
                "px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                nicheColor,
              )}
            >
              {niche}
            </span>

            {/* Name */}
            <h2 className="text-[22px] font-extrabold leading-tight tracking-tight text-white">
              {name}
            </h2>

            {/* Followers */}
            <div className="mt-2 flex items-center gap-1.5 text-zinc-300">
              <Users className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              <span className="text-[13px] font-medium">
                {formatFollowers(followers)}
                <span className="ml-1 text-zinc-500">підписників</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer strip ─────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <p className="min-w-0 flex-1 truncate text-[12px] leading-relaxed text-zinc-500">
            {blogger.shortDescription.slice(0, 58)}…
          </p>

          <span
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-xl",
              "border border-violet-500/35 bg-violet-500/10",
              "px-3.5 py-2 text-[12px] font-semibold text-violet-300",
              "transition-all duration-200",
              "hover:border-violet-400/60 hover:bg-violet-500/20 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
            )}
          >
            Профіль
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </motion.div>
    </motion.article>
  );
}
