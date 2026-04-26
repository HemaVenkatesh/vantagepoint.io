import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Style Essence - Personal Fashion Intelligence",
  description: "Discover your perfect style with AI-powered fashion analysis. Get personalized color recommendations, wardrobe insights, and curated style advice based on your unique personality.",
  keywords: ["fashion", "style", "color analysis", "wardrobe", "personal styling", "AI fashion"],
  authors: [{ name: "Style Essence" }],
  openGraph: {
    title: "Style Essence - Personal Fashion Intelligence",
    description: "Discover your perfect style with AI-powered fashion analysis",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfcfb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[rgb(253,251,249)]">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
