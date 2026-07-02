import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, CartProvider } from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Victory Fashion Design — Bespoke Tailoring & Academy in Ruiru",
  description: "Victory Fashion Design (Ruiru, Kenya) offers custom dressmaking, bridal wear, corporate uniforms, repairs, and our flagship Fashion Training Academy.",
  keywords: ["tailor Ruiru", "fashion academy Ruiru", "bespoke dressmaker Kenya", "bridal tailor Nairobi", "fashion school Ruiru", "clothing repairs Ruiru"],
  metadataBase: new URL("https://vfd-shop.vercel.app"),
  openGraph: {
    title: "Victory Fashion Design — Bespoke Tailoring & Academy",
    description: "Premium bespoke custom dressmaking, bridal wear, corporate uniforms, and professional fashion courses in Ruiru, Kiambu County, Kenya.",
    url: "https://vfd-shop.vercel.app",
    siteName: "Victory Fashion Design",
    images: [
      {
        url: "/assets/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Victory Fashion Design Studio",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Victory Fashion Design — Bespoke Tailoring & Academy",
    description: "Premium bespoke custom dressmaking, bridal wear, and fashion training school in Ruiru.",
    images: ["/assets/images/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Victory Fashion Design Journal Feed" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
