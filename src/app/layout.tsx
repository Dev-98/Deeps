import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans, Caveat } from "next/font/google";
import { ProgressProvider } from "@/lib/progress";
import { ReplayButton } from "@/components/ui/ReplayButton";
import { HuntCounter } from "@/components/ui/HuntCounter";
import { MusicDrawer } from "@/components/ui/MusicDrawer";
import { TransitionProvider } from "@/components/transitions/TransitionProvider";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A door, and then everything",
  description: "Something small, made on purpose.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f7efe3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body className="min-h-dvh antialiased">
        <ProgressProvider>
          <TransitionProvider>
            {children}
            <ReplayButton />
            <HuntCounter />
            <MusicDrawer />
          </TransitionProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
