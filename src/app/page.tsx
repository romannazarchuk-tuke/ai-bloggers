"use client";

import { useState, useCallback, useEffect } from "react";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import ProfileSheet from "@/components/ProfileSheet";
import type { Blogger } from "@/data/mockData";

export default function Home() {
  const [selectedBlogger, setSelectedBlogger] = useState<Blogger | null>(null);

  // Ensure page always starts at the top on reload (removes hash jump)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Remove hash from URL silently if it exists
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      // Force scroll to top
      window.scrollTo(0, 0);
    }
  }, []);

  const handleSelectBlogger = useCallback((blogger: Blogger) => {
    setSelectedBlogger(blogger);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedBlogger(null);
  }, []);

  return (
    <main className="ambient-bg min-h-screen w-full overflow-x-hidden">
      <Hero />
      <Catalog onSelectBlogger={handleSelectBlogger} />
      <ProfileSheet blogger={selectedBlogger} onClose={handleCloseSheet} />
    </main>
  );
}
