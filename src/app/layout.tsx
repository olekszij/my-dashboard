import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'antd/dist/reset.css';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Music Player",
  description: "A modern music player built with Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Music Player",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={`antialiased ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
