// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Serif_Text, Playfair_Display } from "next/font/google";
import { Notable } from "next/font/google";
import "./globals.css";
import TransitionProvider from '../components/TransitionProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

const notable = Notable({
  variable: "--font-notable",
  subsets: ["latin"],
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  // For variable font, you can specify the weight range or use empty array
  // axes: ["opsz"],
  // Or if you want specific weights:
  // weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aura | AI Logo Maker",
  description: "Create stunning logos with AI",
  icons: {
    icon: "/Aura_logo.png", // Favicon
  },
  openGraph: {
    title: "Aura | AI Logo Maker",
    description: "Create stunning logos with AI",
    images: [
      {
        url: "/Aura-logo.png", // OG image
        width: 1200,
        height: 630,
        alt: "Aura Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${dmSerifText.variable} ${notable.variable} ${playfairDisplay.variable}`}>
      <body className={`antialiased ${geistSans.className}`}>
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}