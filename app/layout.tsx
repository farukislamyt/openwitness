import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OpenWitness",
    template: "%s | OpenWitness",
  },
  description:
    "বাংলাদেশের জন্য একটি anonymous public-interest reporting platform।",
  applicationName: "OpenWitness",
  authors: [{ name: "Faruk Islam" }],
  creator: "Faruk Islam",
  publisher: "OpenWitness",
  metadataBase: new URL("https://openwitness.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${notoSansBengali.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}