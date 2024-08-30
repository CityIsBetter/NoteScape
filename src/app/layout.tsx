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
  title: "NoteScape",
  description: "Website to meet your note taking needs, its more than a note taking app!",
  openGraph: {
    title:"NoteScape",
    description: "Website to meet your note taking needs, its more than a note taking app!",
    siteName:"NoteScape",
    url:"https://notescape.vercel.app",
    images:[{
      url:'/logo.png'
    }],
    locale: "en-EN",
    type: "website",
  },
  other: {
    "google-site-verification":"IVOjL--iVz33j73JnMvQT2vZsRoEje6C9GQGxF8BlxQ"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
          <div className="main flex flex-row overflow-hidden">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
