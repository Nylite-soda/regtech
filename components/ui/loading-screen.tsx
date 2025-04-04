"use client";

import { useEffect, useState } from "react";
import { useNavigation } from "@/components/navigation/navigation-context";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: isNavigating, setIsLoading: setNavigationLoading } = useNavigation();

  useEffect(() => {
    if (document.readyState === "complete") {
      setTimeout(() => {
        setIsLoading(false);
        setNavigationLoading(false);
      }, 800);
    }

    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        setNavigationLoading(false);
      }, 800);
    };

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, [setNavigationLoading]);

  const shouldShow = isLoading || isNavigating;

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center min-h-screen">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-24 h-24 border-4 border-black border-t-transparent rounded-full animate-spin absolute"></div>

        {/* Middle Ring */}
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin-slow absolute"></div>

        {/* Inner Ring */}
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin-reverse absolute"></div>

        {/* Text in Center */}
        <span className="text-black text-lg font-bold mt-45">
          {isNavigating ? "Loading page..." : "Loading..."}
        </span>
      </div>
    </div>
  );
} 