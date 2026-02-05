import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dreamy Dashboard | Client & Revenue Tracking",
  description: "Track Dreamy client projects, revenue, and timelines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
