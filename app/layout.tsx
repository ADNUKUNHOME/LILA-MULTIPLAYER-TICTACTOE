import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomToaster from "@/components/ui/CustomToaster";
import { SocketProvider } from "@/context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lila — Multiplayer Tic Tac Toe",
  description:
    "A real-time multiplayer Tic Tac Toe game built with Next.js, Socket.IO, and TypeScript. Features smooth animations and modern UI design.",
  keywords: [
    "Tic Tac Toe",
    "Multiplayer",
    "Real-time Game",
    "Next.js",
    "Socket.IO",
    "Framer Motion",
    "TypeScript",
  ],
  authors: [{ name: "Muhammad Adnan" }],
  creator: "Muhammad Adnan",
  openGraph: {
    title: "Lila — Multiplayer Tic Tac Toe",
    description:
      "Play Tic Tac Toe online with real-time updates and smooth animations. Built with Next.js and Socket.IO.",
    siteName: "Lila",
    images: [
      {
        url: "/favicon.ico",
        width: 812,
        height: 812,
        alt: "Lila Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lila — Multiplayer Tic Tac Toe",
    description:
      "A clean and modern real-time Tic Tac Toe game powered by Next.js and Socket.IO.",
    images: ["/favicon.ico"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <SocketProvider>{children}</SocketProvider>
        <CustomToaster />
      </body>
    </html>
  );
}
