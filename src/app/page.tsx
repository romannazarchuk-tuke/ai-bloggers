"use client";

import { useState, useCallback } from "react";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import ProfileSheet from "@/components/ProfileSheet";
import type { Blogger } from "@/data/mockData";

export default function Home() {
  const [selectedBlogger, setSelectedBlogger] = useState<Blogger | null>(null);

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
