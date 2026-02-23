import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "AquaGov",
  description: "Drought Governance and Water Tanker Management Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="bg-[#F3F4F6] text-slate-900 antialiased flex min-h-screen">
        {children}
      </body>
    </html>
  );
}
