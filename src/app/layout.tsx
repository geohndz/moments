import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/cn";
import { buildFirebasePublicConfigFromEnv } from "@/lib/firebase/public-config";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Moments — our memory album",
  description:
    "A quiet little app for us to keep polaroids, notes, and milestones together—just for the two of us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const firebasePublicJson = JSON.stringify(
    buildFirebasePublicConfigFromEnv(),
  ).replace(/</g, "\\u003c");

  return (
    <html
      lang="en"
      className={cn(
        manrope.variable,
        fraunces.variable,
        "dark h-full min-h-dvh antialiased",
      )}
    >
      <body className="min-h-dvh font-sans">
        <Script
          id="moments-firebase-public"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.__MOMENTS_FIREBASE__=${firebasePublicJson};`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
