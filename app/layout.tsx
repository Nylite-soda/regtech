import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { NavigationProvider } from "@/components/navigation/navigation-context";
import { BackButton } from "@/components/ui/back-button";
import { ToastProvider } from "@/components/ui/toast-context";
import { ThemeProvider } from "@/lib/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider defaultTheme="light" storageKey="regtech-theme">
          <ToastProvider>
            <NavigationProvider>
              <BackButton />
              <PageWrapper>{children}</PageWrapper>
            </NavigationProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
