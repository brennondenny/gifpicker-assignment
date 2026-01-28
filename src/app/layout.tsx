import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GIF Picker",
  description: "Quickly search and share GIFs from GIPHY",
  keywords: "gif, giphy, search",
  authors: [{ name: "Brennon Denny" }],
  creator: "Brennon Denny",
  publisher: "GIF Picker",
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
