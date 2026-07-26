import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storm Atlas | Offline Run Companion",
  description: "A web clone of the Storm Atlas offline-first Risk of Rain 2 companion, with item lookup, build tracking, and fast field reference.",
  icons: {
    icon: [{ url: "/assets/storm-atlas-app-icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/assets/storm-atlas-app-icon.png",
    apple: "/assets/storm-atlas-app-icon.png",
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#080c11",
  openGraph: {
    title: "Storm Atlas",
    description: "Your run. Under control.",
    images: [{ url: "/og-app-views.png", width: 1200, height: 630, alt: "Storm Atlas Items, Build, and Reference screens" }],
  },
  twitter: { card: "summary_large_image", title: "Storm Atlas", description: "Your run. Under control.", images: ["/og-app-views.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
