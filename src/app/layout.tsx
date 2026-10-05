import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";
import { Nav } from "@/components/nav";
import { CommandPalette } from "@/components/command-palette";
import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} | Mechanical engineering portfolio`,
  description:
    "Mechanical engineering student at Carnegie Mellon, minor in robotics. Projects in mechanical design, fabrication, and robotics.",
  openGraph: {
    title: site.name,
    description: "Mechanical design, fabrication, and robotics projects.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f3f2" },
    { media: "(prefers-color-scheme: dark)", color: "#111518" },
  ],
};

// Applies a saved theme before paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-[100dvh]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-surface focus:px-3 focus:py-2 font-mono text-meta"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <CommandPalette />
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
