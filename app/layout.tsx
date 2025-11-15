import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Text, Audiowide } from "next/font/google";
import "./globals.css";

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

const dmSerifTextItalic = DM_Serif_Text({
  variable: "--font-dm-serif-italic",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

// Use Audiowide as a substitute for Notable (similar bold, techy font)
const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Aura+ | AI Logo Maker",
  description: "Create stunning logos with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${dmSerifText.variable} ${dmSerifTextItalic.variable} ${audiowide.variable}`}>
      <body className={`antialiased ${geistSans.className}`}>
        {children}
      </body>
    </html>
  );
}