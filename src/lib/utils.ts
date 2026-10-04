import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes intelligently, resolving conflicts
 * via tailwind-merge and handling conditional classes via clsx.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-violet-500", "text-white")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a follower count number into a human-readable string.
 * @example formatFollowers(1_250_000) → "1.25M"
 */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(2)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return String(count);
}

/**
 * Prepends the deployment basePath so public-folder images resolve
 * correctly on GitHub Pages (and other static hosts with a sub-path).
 *
 * Locally NEXT_PUBLIC_BASE_PATH is "" so paths stay unchanged.
 * @example getImagePath("/images/model-1.jpg") → "/ai-bloggers/images/model-1.jpg"
 */
export function getImagePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
