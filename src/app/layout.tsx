import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ipsumlogo — Free Online Logo Editor",
  description:
    "Create professional logos with our free drag-and-drop logo editor. Figma-style canvas, custom shapes, Google Fonts, and export as SVG, PNG, or JPG.",
  keywords: ["logo editor", "logo maker", "svg editor", "logo design", "free logo maker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%", margin: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
