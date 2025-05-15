"use client";
import { useEffect, useState } from "react";
import { useNavigation } from "@/components/navigation/navigation-context";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: isNavigating, setIsLoading: setNavigationLoading } =
    useNavigation();
  const [textPhase, setTextPhase] = useState(11);

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

  // Animate the entire "Loading..." text
  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextPhase((prev) => (prev - 1) % 12);
    }, 100);
    return () => clearInterval(textInterval);
  }, []);

  const shouldShow = isLoading || isNavigating;
  if (!shouldShow) return null;

  // Create animated "Loading..." text
  const renderAnimatedText = () => {
    const word = "Loading...";
    return word.split("").map((char, index) => {
      // Calculate animation phase for this character
      const charPhase = (textPhase + index) % 12;

      // Different effects based on phase
      let transform = "translateY(0)";
      let scale = "scale(1.02)";
      let color = "text-black";

      if (charPhase < 3) {
        // Going up
        transform = `translateY(-${charPhase * 2}px)`;
        scale = `scale(${1 + charPhase * 0.05})`;
        color = charPhase === 2 ? "text-red-600" : "text-black";
      } else if (charPhase < 6) {
        // Going down
        transform = `translateY(-${(6 - charPhase) * 2}px)`;
        scale = `scale(${1 + (6 - charPhase) * 0.05})`;
        color = "text-black";
      }

      return (
        <span
          key={index}
          className={`inline-block transition-all duration-150 ${color}`}
          style={{
            transform: `${transform} ${scale}`,
            animationDelay: `${index * 0.05}s`,
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center min-h-screen overflow-hidden">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-red-600 animate-pulse"></div> */}
          <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
            {Array(100)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-300 opacity-20"
                ></div>
              ))}
          </div>
        </div>

        {/* Spinner container */}
        <div className="relative w-32 h-32 mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-6 border-black border-t-transparent rounded-full animate-spin"></div>

          {/* Middle Ring */}
          <div className="absolute inset-4 border-6 border-red-600 border-t-transparent rounded-full animate-spin-slow"></div>

          {/* Inner Ring */}
          <div className="absolute inset-8 border-6 border-black border-t-transparent rounded-full animate-spin-reverse"></div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Text with animated letters and glow effect */}
        <div className="relative">
          {/* <div className="text-xl font-bold tracking-wider relative z-10 flex justify-center">
            {renderAnimatedText()}
          </div> */}
          <div className="absolute inset-0 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-red-600 filter animate-pulse flex justify-center">
            {renderAnimatedText()}
          </div>
        </div>
      </div>
    </div>
  );
}
