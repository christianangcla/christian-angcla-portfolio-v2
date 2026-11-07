import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CosmicWorld } from "@/components/visual/CosmicWorld";
import { GalaxyNav } from "@/components/layout/GalaxyNav";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { BootIntro } from "@/components/ui/BootIntro";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Christian's Lab | Software Engineering & Navigable 3D Universe",
  description:
    "Personal engineering laboratory, interactive digital universe, and portfolio of Christian Constantino Angcla.",
  keywords: [
    "Christian Angcla",
    "Christian Constantino Angcla",
    "Software Engineering",
    "Full-Stack Web Development",
    "Three.js",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-midnight-void relative overflow-x-hidden bg-ambient-vignette">
        <ThemeProvider>
          {/* Persistent 3D WebGL Universe Canvas (Fixed at z-0) */}
          <CosmicWorld />
          <CustomCursor />
          <BootIntro />

          {/* Subtle Architectural Dot Matrix Overlay */}
          <div className="fixed inset-0 z-[1] bg-dot-matrix pointer-events-none opacity-40 dark:opacity-30" aria-hidden="true" />

          {/* Persistent Galaxy Flight Navigation Console (Fixed at z-40) */}
          <GalaxyNav />

          {/* Sticky Header with Travel Routing (Sticky at z-50) */}
          <SiteHeader />

          {/* SmoothScroll Provider synchronizing Lenis with GSAP ScrollTrigger */}
          <SmoothScroll>
            {/* Main Universe Experience Layer (Floating at relative z-10) */}
            <main className="relative z-10 flex-1 w-full bg-transparent flex flex-col">
              {children}
            </main>

            {/* Universal Footer with Quick Navigation (Relative z-10) */}
            <SiteFooter />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
