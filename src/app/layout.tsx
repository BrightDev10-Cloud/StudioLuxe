import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://studioluxe.xyz'), // Update with actual domain
  title: {
    default: "Studio Luxe | Full-Stack Cloud/AI Design & Development",
    template: "%s | Studio Luxe",
  },
  description: "Studio Luxe is a digital product studio crafting high-end web experiences, AI agents, and mobile applications with a tech-brutalist aesthetic.",
  keywords: ["Design Agency", "Next.js", "AI Development", "Web Design", "Brutalism", "Studio Luxe"],
  authors: [{ name: "Studio Luxe Team" }],
  creator: "Studio Luxe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studioluxe.xyz",
    title: "Studio Luxe | Build Something Iconic",
    description: "Full-Stack Cloud/AI Design & Development Studio. Lean, fast, and ruthless with execution.",
    siteName: "Studio Luxe",
    images: [
      {
        url: "/Luxe Studio/logo_icon.svg", // Ideally use a large 1200x630 png for OG images
        width: 1200,
        height: 630,
        alt: "Studio Luxe Og Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Luxe | Full-Stack Cloud/AI Design & Development",
    description: "We build premium digital products with a tech-brutalist edge.",
    images: ["/Luxe Studio/logo_icon.svg"],
    creator: "@studioluxe",
  },
};

import { Lato, Montserrat } from "next/font/google"; // Optimized fonts

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${lato.variable} ${montserrat.variable}`}>
      <body>
        <SmoothScroll>
          <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
            <Preloader />
            <Navbar />
            <CustomCursor />
            {children}
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
