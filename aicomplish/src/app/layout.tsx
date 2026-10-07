import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import page from "@/components/page.module.css";
import { MainNav } from "@/components/MainNav";
import ui from "@/components/ui.module.css";

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
          <header className={page.header}>
            <h1 className={page.logo}>
              <Link href="/">
                AI<span>complish</span>
              </Link>
            </h1>
            <MainNav />
            <Link href="/tasks/new" className={`${ui.btn} ${ui.primary}`}>
              + New task
            </Link>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
