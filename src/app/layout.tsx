import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GIF Picker",
  description: "Search and share GIFs from GIPHY",
  keywords: "gif, giphy, search",
  authors: [{ name: "Brennon Denny" }],
  creator: "Brennon Denny",
  publisher: "GIF Picker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // TODO: metadataBase: new URL(""),
  openGraph: {
    title: "GIF Picker - Search & Share GIFs",
    description: "Search and share GIFs from GIPHY",
    type: "website",
    locale: "en_US",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
