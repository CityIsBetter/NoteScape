import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  applicationName: "NoteScape",
  title: "NoteScape",
  description: "Website to meet your note taking needs, it's more than a note-taking app!",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "NoteScape",
    description: "Website to meet your note taking needs, it's more than a note-taking app!",
    siteName: "NoteScape",
    url: "https://notescape.vercel.app",
    images: [
      {
        url: "/logo.png",
      },
    ],
    locale: "en-UK",
    type: "website",
  },
  other: {
    "google-site-verification": "IVOjL--iVz33j73JnMvQT2vZsRoEje6C9GQGxF8BlxQ",
  },
  manifest: "/manifest.json", // Added the manifest metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Dark theme color */}
        <meta name="theme-color" content="#171D26" media="(prefers-color-scheme: dark)" />
        {/* Light theme color */}
        <meta name="theme-color" content="#E8E8EF" media="(prefers-color-scheme: light)" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="main flex flex-row overflow-hidden scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-text">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
