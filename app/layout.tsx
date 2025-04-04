import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { NavigationProvider } from "@/components/navigation/navigation-context";
import { BackButton } from "@/components/ui/back-button";
import { ToastProvider } from "@/components/ui/toast-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RegTech",
  description: "Regulatory Technology Platform",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <NavigationProvider>
            <BackButton />
            <PageWrapper>{children}</PageWrapper>
          </NavigationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
