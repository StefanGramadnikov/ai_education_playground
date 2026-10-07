import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import page from "@/components/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "AIcomplish", template: "%s · AIcomplish" },
  description: "A fast, minimal task manager.",
};

export const viewport: Viewport = { colorScheme: "light dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className={page.shell}>
          <SiteHeader />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
