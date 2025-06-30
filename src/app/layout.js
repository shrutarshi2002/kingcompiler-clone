import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatbotWrapper from "../components/ChatbotWrapper";
import LoadingScreen from "../components/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "KingCompiler - Online Academy for Chess, Coding, AI & Robotics for Kids",
  description:
    "Transform your child's future with expert-led online classes in Chess, Coding, AI, Robotics, and more. Free trial available. Join 1000+ happy students!",
  keywords:
    "online chess classes, coding for kids, AI classes, robotics for children, online education, kids programming, chess academy, STEM education, online learning",
  authors: [{ name: "KingCompiler Academy" }],
  creator: "KingCompiler Academy",
  publisher: "KingCompiler Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kingmaster.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "KingCompiler - Online Academy for Chess, Coding, AI & Robotics for Kids",
    description:
      "Transform your child's future with expert-led online classes in Chess, Coding, AI, Robotics, and more. Free trial available.",
    url: "https://kingmaster.com",
    siteName: "KingCompiler Academy",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "KingCompiler Academy - Online Learning for Kids",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "KingCompiler - Online Academy for Chess, Coding, AI & Robotics for Kids",
    description:
      "Transform your child's future with expert-led online classes. Free trial available!",
    images: ["/banner.png"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingScreen />
        {children}
        <ChatbotWrapper />
      </body>
    </html>
  );
}
