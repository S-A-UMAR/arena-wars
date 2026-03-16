import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Arena Wars - Mobile Legends Esports Platform",
    template: "%s | Arena Wars",
  },
  description:
    "The premier esports platform for Mobile Legends: Bang Bang. Compete in tournaments, join guilds, find scrims, and climb the leaderboards.",
  keywords: [
    "Mobile Legends",
    "MLBB",
    "esports",
    "tournament",
    "gaming",
    "competitive",
    "guild",
    "scrims",
  ],
  authors: [{ name: "Arena Wars" }],
  creator: "Arena Wars",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arenawars.gg",
    siteName: "Arena Wars",
    title: "Arena Wars - Mobile Legends Esports Platform",
    description:
      "The premier esports platform for Mobile Legends: Bang Bang. Compete in tournaments, join guilds, find scrims, and climb the leaderboards.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arena Wars - Mobile Legends Esports Platform",
    description:
      "The premier esports platform for Mobile Legends: Bang Bang.",
    creator: "@arenawars",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0d0d12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.17 0.02 260)",
              border: "1px solid oklch(0.30 0.02 260)",
              color: "oklch(0.97 0.01 260)",
            },
          }}
        />
      </body>
    </html>
  );
}
