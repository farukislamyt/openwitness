import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OpenWitness — জনস্বার্থের ঘটনা নথিভুক্ত করুন",
    template: "%s | OpenWitness",
  },
  description:
    "বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform। পরিচয় প্রকাশ না করেই ঘটনা রিপোর্ট করুন।",
  keywords: [
    "OpenWitness",
    "anonymous reporting",
    "জনস্বার্থ",
    "বাংলাদেশ",
    "ঘটনা রিপোর্ট",
    "দুর্নীতি",
    "প্রতারণা",
    "সাইবার অপরাধ",
  ],
  applicationName: "OpenWitness",
  authors: [{ name: "OpenWitness" }],
  creator: "OpenWitness",
  publisher: "OpenWitness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://openwitness.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://openwitness.vercel.app",
    siteName: "OpenWitness",
    title: "OpenWitness — জনস্বার্থের ঘটনা নথিভুক্ত করুন",
    description:
      "বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform। পরিচয় প্রকাশ না করেই ঘটনা রিপোর্ট করুন।",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenWitness — জনস্বার্থের ঘটনা নথিভুক্ত করুন",
    description:
      "বাংলাদেশের জনস্বার্থে একটি anonymous reporting platform।",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body
        className={`${notoSansBengali.variable} font-sans antialiased`}
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}