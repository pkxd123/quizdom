import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizdom – Dobyvatel",
  description: "Multiplayerová kvízová hra – obsaď celé Česko!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="dark">
      <body>{children}</body>
    </html>
  );
}
