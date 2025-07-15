import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import fs from "fs";
import path from "path";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load site text settings for metadata
function getSiteText() {
  try {
    const filePath = path.join(process.cwd(), "settings", "site-text.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading site text:", error);
    return {
      metadata: {
        title: "Ich Liebe Dich 💕",
        description: "A romantic journey through Daniel's trip to Japan",
        keywords: "love, Japan, journey",
      },
    };
  }
}

export function generateMetadata(): Metadata {
  const siteText = getSiteText();

  return {
    title: siteText.metadata?.title || "Für dich Mein Schatz 💕",
    description:
      siteText.metadata?.description ||
      "A romantic journey through Daniel's trip to Japan",
    keywords: siteText.metadata?.keywords,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
