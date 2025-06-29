import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatbotWrapper from "../components/ChatbotWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "KingCompiler",
  description:
    "KingCompiler - Online Academy for Chess, Coding, and AI for Kids.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatbotWrapper />
      </body>
    </html>
  );
}
