"use client";

import { createContext, useContext, useState, useEffect, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface NavigationContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function NavigationProviderContent({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    startLoading();
    const timeout = setTimeout(stopLoading, 5000);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams, startLoading, stopLoading]);

  return (
    <NavigationContext.Provider 
      value={{ 
        isLoading, 
        setIsLoading,
        startLoading,
        stopLoading
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <NavigationProviderContent>
        {children}
      </NavigationProviderContent>
    </Suspense>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
} 