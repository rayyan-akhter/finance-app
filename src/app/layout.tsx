import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientThemeProvider from '@/components/ClientThemeProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FinanceApp - Smart Financial Management",
  description: "Take control of your financial future with our advanced tools and insights. Track expenses, manage savings, and grow your wealth.",
  keywords: "finance, budgeting, expense tracking, savings, investments, financial management",
  authors: [{ name: "FinanceApp Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "FinanceApp - Smart Financial Management",
    description: "Take control of your financial future with our advanced tools and insights.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanceApp - Smart Financial Management",
    description: "Take control of your financial future with our advanced tools and insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-white dark:bg-gray-900 transition-colors duration-300">
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
