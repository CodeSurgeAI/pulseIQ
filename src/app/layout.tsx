import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";

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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
