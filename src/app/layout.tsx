import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Блогери — Віртуальні Інфлюенсери",
    template: "%s | AI Блогери",
  },
  description:
    "Відкрий для себе нове покоління AI-блогерів у сферах технологій, лайфстайлу, спорту та крипти.",
  keywords: ["AI блогери", "віртуальні інфлюенсери", "next.js"],
  authors: [{ name: "AI Blogger Showcase" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    title: "AI Блогери — Віртуальні Інфлюенсери",
    description:
      "Відкрий для себе нове покоління AI-блогерів у сферах технологій, лайфстайлу, спорту та крипти.",
    siteName: "AI Blogger Showcase",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Блогери",
    description: "Віртуальні інфлюенсери на базі штучного інтелекту.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} dark`}
      suppressHydrationWarning
    >
      <body
        className="bg-zinc-950 text-zinc-100 antialiased selection:bg-violet-500/30 selection:text-violet-100"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
