import type { Metadata } from "next";
import { VT323, Press_Start_2P, Share_Tech_Mono } from 'next/font/google';
import "./globals.css";

const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323' });
const pressStart2P = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press-start' });
const shareTechMono = Share_Tech_Mono({ weight: '400', subsets: ['latin'], variable: '--font-share-tech' });

export const metadata: Metadata = {
  title: "INTERVIEW.OS",
  description: "Underground Interview Terminal",
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
