"use client";

import { Suspense, useEffect } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useNavigation } from "@/components/navigation/navigation-context";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const { startLoading, stopLoading } = useNavigation();

  useEffect(() => {
    // Start loading when component mounts
    startLoading();

    // Stop loading when component unmounts
    return () => stopLoading();
  }, [startLoading, stopLoading]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="min-h-screen">
        {children}
      </main>
    </Suspense>
  );
} 