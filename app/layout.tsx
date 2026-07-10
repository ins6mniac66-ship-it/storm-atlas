import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storm Atlas | Your run. Under control.",
  description: "An offline-first Risk of Rain 2 companion for item lookup, build tracking, survivor planning, and fast in-run reference.",
  icons: { icon: "/assets/storm-atlas-icon.png", shortcut: "/assets/storm-atlas-icon.png" },
  openGraph: {
    title: "Storm Atlas",
    description: "Your run. Under control.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Storm Atlas tactical companion interface" }],
  },
  twitter: { card: "summary_large_image", title: "Storm Atlas", description: "Your run. Under control.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
