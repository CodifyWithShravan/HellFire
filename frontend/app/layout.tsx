import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MarketAI Suite | AI-Powered Sales & Marketing Platform",
  description: "Generate AI-powered marketing campaigns, craft intelligent sales pitches, and qualify leads with Groq's LLaMA 3.3 70B. Transform your sales and marketing operations.",
  keywords: ["AI marketing", "sales pitch generator", "lead scoring", "Groq AI", "LLaMA", "campaign generator", "B2B sales"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <div className="war-room-bg" />
        {children}
      </body>
    </html>
  );
}
