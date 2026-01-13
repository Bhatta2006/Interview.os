import type { Metadata } from "next";
import { VT323, Press_Start_2P, Share_Tech_Mono } from 'next/font/google';
import "./globals.css";

const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323' });
const pressStart2P = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press-start' });
const shareTechMono = Share_Tech_Mono({ weight: '400', subsets: ['latin'], variable: '--font-share-tech' });

export const metadata: Metadata = {
  title: {
    template: '%s | INTERVIEW.OS',
    default: 'INTERVIEW.OS // SYSTEM_READY',
  },
  description: "Elite interview preparation terminal. Track progress, maintain streaks, and dominate the algorithm implementations.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  keywords: ["LeetCode", "Interview Prep", "Tracker", "Developer", "Terminal UI"],
  openGraph: {
    title: 'INTERVIEW.OS',
    description: 'Underground Interview Terminal for Elite Developers',
    url: 'https://solveit.vercel.app',
    siteName: 'INTERVIEW.OS',
    images: [
      {
        url: 'https://via.placeholder.com/800x400.png?text=INTERVIEW.OS', // Placeholder until real OG image
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INTERVIEW.OS',
    description: 'Track your LeetCode progress in style.',
    creator: '@Bhatta2006',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${vt323.variable} ${pressStart2P.variable} ${shareTechMono.variable} font-primary antialiased bg-black text-white selection:bg-terminal-green selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
