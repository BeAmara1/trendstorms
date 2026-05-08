import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://trendpulse.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Trendpulse — Cultural Trends Dashboard",
    template: "%s | Trendpulse",
  },
  description:
    "Real-time cultural trends analytics dashboard powered by Spotify, Steam, TMDB and Google Trends. Track music, gaming, and movie trends.",
  keywords: [
    "trends",
    "analytics",
    "dashboard",
    "cultural trends",
    "spotify",
    "steam",
    "tmdb",
    "data visualization",
  ],
  authors: [{ name: "Trendpulse" }],
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Trendpulse",
    title: "Trendpulse — Cultural Trends Dashboard",
    description:
      "Real-time cultural trends analytics dashboard powered by Spotify, Steam, TMDB and Google Trends.",
    url: baseUrl,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Trendpulse Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trendpulse — Cultural Trends Dashboard",
    description:
      "Real-time cultural trends analytics dashboard powered by Spotify, Steam, TMDB and Google Trends.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
