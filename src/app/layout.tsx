import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseIQ - Healthcare Analytics Platform",
  description: "AI-powered hospital performance management platform with advanced analytics and federated learning by CodeSurge AI",
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
