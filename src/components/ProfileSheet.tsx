"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useSpring, useMotionValue } from "framer-motion";
import {
  X,
  Send,
  Users,
  Heart,
  MessageCircle,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { cn, formatFollowers } from "@/lib/utils";
import type { Blogger, Post } from "@/data/mockData";

// ── Animation Variants ────────────────────────────────────────────

const scrimVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit:   { opacity: 0, transition: { duration: 0.22, ease: "easeIn"  } },
};

/** Elastic spring slide-up — overshoots slightly then settles */
const sheetVariants = {
  hidden: { y: "100%", opacity: 0.5 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 26,
      mass: 0.9,
    },
  },
  exit: {
    y: "100%",
    opacity: 0.5,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 32,
    },
  },
};

const feedContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } },
};

const feedItemVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── Helpers ───────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCount(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── PostCard — accordion ──────────────────────────────────────────

interface PostCardProps {
  post: Post;
  isOpen: boolean;
  onToggle: () => void;
}

function PostCard({ post, isOpen, onToggle }: PostCardProps) {
  return (
    <motion.article
      variants={feedItemVariants}
      className={cn(
        "overflow-hidden rounded-xl border bg-white/[0.03]",
        "transition-colors duration-200",
        isOpen
          ? "border-violet-500/30 bg-violet-500/[0.05]"
          : "border-white/[0.07] hover:border-white/[0.13] hover:bg-white/[0.05]",
      )}
    >
      {/* ── Header — always visible, click to toggle ── */}
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <h4
          className={cn(
            "text-sm font-semibold leading-snug transition-colors duration-200",
            isOpen ? "text-violet-200" : "text-zinc-100",
          )}
        >
          {post.title}
        </h4>

        {/* Chevron icon — rotates when open */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="mt-0.5 shrink-0 text-zinc-500"
          aria-hidden="true"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* ── Expandable body ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4">
              {/* Description */}
              <p className="text-[13px] leading-relaxed text-zinc-400">
                {post.description}
              </p>

              {/* Meta row */}
              <div className="mt-3 flex items-center gap-4 text-zinc-600">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Heart className="h-3 w-3" aria-hidden="true" />
                  {formatCount(post.likes)}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <MessageCircle className="h-3 w-3" aria-hidden="true" />
                  {formatCount(post.comments)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ── StatPill ──────────────────────────────────────────────────────

function StatPill({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-1.5 text-zinc-500">
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-lg font-bold text-zinc-100">{value}</span>
    </div>
  );
}

// ── Telegram CTA ──────────────────────────────────────────────────

function TelegramButton({ name }: { name: string }) {
  // Framer Motion "breathing" scale — continuous inhale/exhale on the glow
  const glowScale = useMotionValue(1);
  const smoothGlow = useSpring(glowScale, { stiffness: 60, damping: 8 });

  return (
    <div className="relative">
      {/* Breathing glow layer — behind the button */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 blur-xl opacity-60"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.a
        href="https://t.me/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative flex w-full items-center justify-center gap-3 overflow-hidden",
          "rounded-2xl px-6 py-4",
          "bg-gradient-to-r from-blue-500 to-blue-600",
          "text-base font-bold text-white tracking-wide",
          // Static glow shadow + extra vivid on hover
          "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
          "hover:shadow-[0_0_36px_rgba(59,130,246,0.75)]",
          "transition-shadow duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-label={`Відкрити Telegram-канал ${name}`}
      >
        {/* Ping ring */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl ring-2 ring-blue-400/50 animate-ping"
          style={{ animationDuration: "2.2s" }}
        />

        <Send className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>Перейти в Telegram</span>
      </motion.a>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────

interface ProfileSheetProps {
  blogger: Blogger | null;
  onClose: () => void;
}

export default function ProfileSheet({ blogger, onClose }: ProfileSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  // Tracks which post is expanded — null means all collapsed
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Auto-focus close button (a11y)
  useEffect(() => {
    if (blogger) {
      const t = setTimeout(() => closeRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [blogger]);

  // Reset local UI state when switching to a different blogger
  useEffect(() => {
    setIsDialogueOpen(false);
    setExpandedPostId(null);
  }, [blogger?.id]);

  // Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (!blogger || e.key !== "Tab" || !sheetRef.current) return;

      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [blogger]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = blogger ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [blogger]);

  return (
    <AnimatePresence>
      {blogger && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm"
            variants={scrimVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`profile-title-${blogger.id}`}
            ref={sheetRef}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.8 }}
            dragDirectionLock
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className={cn(
              "fixed z-50 overflow-hidden",
              "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl",
              "sm:inset-x-0 sm:bottom-6 sm:mx-auto sm:w-full sm:max-w-[680px] sm:rounded-3xl",
              "border border-white/[0.1] bg-zinc-900",
              "shadow-[0_-8px_60px_rgba(0,0,0,0.6)]",
              "flex flex-col",
            )}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Drag handle */}
            <div aria-hidden="true" className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-zinc-700" />
            </div>

            {/* Header */}
            <div className="relative flex items-start gap-4 px-5 pb-4 pt-4 sm:px-6 sm:pt-5">
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-28 sm:w-20">
                <Image
                  src={blogger.imagePath}
                  alt={`Аватар ${blogger.name}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h2
                    id={`profile-title-${blogger.id}`}
                    className="truncate text-lg font-bold text-zinc-50 sm:text-xl"
                  >
                    {blogger.name}
                  </h2>
                </div>
                <p className="text-sm text-zinc-500">{blogger.handle}</p>
                <span
                  className={cn(
                    "mt-1.5 inline-block rounded-full border border-white/10",
                    "bg-white/[0.07] px-2.5 py-0.5",
                    "text-[11px] font-semibold uppercase tracking-widest",
                    blogger.nicheColor,
                  )}
                >
                  {blogger.niche}
                </span>
              </div>

              <button
                ref={closeRef}
                onClick={onClose}
                className={cn(
                  "shrink-0 rounded-xl p-2",
                  "text-zinc-400 transition-colors duration-150",
                  "hover:bg-white/[0.08] hover:text-zinc-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                )}
                aria-label="Закрити профіль"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Rule */}
            <div className="mx-5 h-px bg-white/[0.06] sm:mx-6" />

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              {/* Stats */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                <StatPill
                  label="Підписники"
                  value={formatFollowers(blogger.followers)}
                  icon={<Users className="h-3.5 w-3.5" />}
                />
                <StatPill
                  label="Підписки"
                  value={blogger.following.toLocaleString("uk-UA")}
                  icon={<Users className="h-3.5 w-3.5" />}
                />
              </div>

              {/* Bio */}
              <p className="mb-6 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                {blogger.shortDescription}
              </p>

              <div className="mb-6 rounded-2xl border border-violet-400/15 bg-violet-500/[0.06] p-4">
                <button
                  type="button"
                  className="w-full rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-center text-sm font-semibold text-violet-200 transition-colors hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  onClick={() => setIsDialogueOpen((open) => !open)}
                  aria-expanded={isDialogueOpen}
                >
                  {isDialogueOpen ? "Сховати приклад діалогу" : "Показати приклад діалогу"}
                </button>

                {isDialogueOpen && (
                  <div className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed">
                    {blogger.chat.map((message) => (
                      <div key={message.visitor} className="flex flex-col gap-2">
                        {/* Visitor bubble — right-aligned, shrinks to text width */}
                        <div className="flex justify-end">
                          <p className="max-w-[78%] break-words rounded-2xl rounded-tr-sm bg-violet-500/25 px-3.5 py-2.5 text-violet-100">
                            {message.visitor}
                          </p>
                        </div>
                        {/* Blogger bubble — left-aligned, shrinks to text width */}
                        <div className="flex justify-start">
                          <p className="max-w-[78%] break-words rounded-2xl rounded-tl-sm bg-white/[0.08] px-3.5 py-2.5 text-zinc-300">
                            {message.blogger}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mini-feed — accordion */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Останні публікації
                </h3>
                <motion.div
                  className="flex flex-col gap-2"
                  variants={feedContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {blogger.posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isOpen={expandedPostId === post.id}
                      onToggle={() =>
                        setExpandedPostId(
                          expandedPostId === post.id ? null : post.id,
                        )
                      }
                    />
                  ))}
                </motion.div>
              </div>

              <div className="h-2" />
            </div>

            {/* Sticky CTA */}
            <div className={cn(
              "shrink-0 px-5 pb-6 pt-4 sm:px-6",
              "border-t border-white/[0.06]",
              "bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent",
            )}>
              <TelegramButton name={blogger.name} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
