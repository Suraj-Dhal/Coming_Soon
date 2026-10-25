import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const title = "Suraj Dhal — Coming Soon";
const description = "Suraj Dhal, Tech & Management Professional. The new surajdhal.com is coming soon.";

// Preview images come from the file convention: app/opengraph-image.jpg,
// app/twitter-image.jpg and their .alt.txt files (see scripts/build-share-images.mjs).
export const metadata: Metadata = {
  metadataBase: new URL("https://surajdhal.com"),
  title,
  description,
  applicationName: "surajdhal.com",
  authors: [{ name: "Suraj Dhal", url: "https://surajdhal.com" }],
  creator: "Suraj Dhal",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://surajdhal.com",
    siteName: "surajdhal.com",
    locale: "en_US",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#cfcfcf",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Suraj Dhal",
  url: "https://surajdhal.com",
  description: "Tech & Management Professional",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </body>
    </html>
  );
}
