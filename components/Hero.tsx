"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchBar from "./ui/SearchBar";

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const revealRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const revealElement = revealRef.current;
    if (!revealElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = revealElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const radius = 180; // Increased size of the reveal circle
      revealElement.style.background = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent, var(--reveal-color) 75%)`;
    };

    const handleMouseLeave = () => {
      revealElement.style.background = 'var(--reveal-color)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    revealElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      revealElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  const countries = [
    { name: "Nigeria", code: "NG" },
    { name: "South Africa", code: "ZA" },
    { name: "Kenya", code: "KE" },
    { name: "Egypt", code: "EG" },
    { name: "Ghana", code: "GH" }
  ];

  return (
    <section 
      className={cn(
        "relative min-h-[80vh] lg:min-h-screen flex items-center overflow-hidden",
        "pt-[70px] lg:pt-10 md:pb-[80px] md:max-h-[1500px]"
      )}
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
    >
      {/* Background Layers */}
      <div className={cn(
        "absolute inset-0 bg-cover bg-center bg-no-repeat z-10",
        "transition-opacity duration-500"
      )}
        style={{
          backgroundImage: "url('/images/map-bg.png')",
          filter: 'grayscale(100%) brightness(0.8)',
          opacity: 1,
        }}
      />
      
      <div className={cn(
        "dark:hidden absolute inset-0 bg-cover bg-center bg-no-repeat -z-1",
        "bg-[url('/images/map2.png')] transition-opacity duration-500"
      )}
        style={{
          filter: 'brightness(0.9)',
          opacity: 1,
        }}
      />
      
      {/* Pattern Overlay */}
      <div className={cn(
        "absolute inset-0 z-15 opacity-30",
        "transition-opacity duration-500"
      )}
        style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, rgba(200, 200, 200, 0.8) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(200, 200, 200, 0.1) 2px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />
      
      {/* Reveal Layer */}
      <div 
        ref={revealRef} 
        className="absolute inset-0 z-20 pointer-events-none transition-all duration-300"
        style={{
          background: "var(--reveal-color)",
          "--reveal-color": "var(--bg-color, rgba(255, 255, 255, 0.2))",
        } as React.CSSProperties}
      />

      {/* Gradient Overlays */}
      <div className={cn(
        "absolute inset-0 z-50",
        "bg-gradient-to-t from-white/60 via-transparent to-white/20",
        "dark:from-black/90 dark:via-transparent dark:to-black/60",
        "transition-colors duration-500"
      )} />
      
      <div className={cn(
        "absolute inset-0 z-50",
        "bg-gradient-to-r from-white/30 via-transparent to-white/30",
        "dark:from-black/80 dark:via-transparent dark:to-black/80",
        "transition-colors duration-500"
      )} />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full mx-auto relative z-60"
      >
        <div className={cn(
          "max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8",
          "py-16 lg:pt-40 sm:py-24 lg:py-28"
        )}>
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={cn(
                  "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]",
                  "text-gray-900 dark:text-white transition-colors duration-300"
                )}
              >
                Discover Africa's Leading{" "}
                <span className={cn(
                  "text-[#AD0000] dark:text-red-500 relative inline-block group",
                  "transition-colors duration-300"
                )}>
                  RegTech
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5",
                    "bg-[#AD0000] dark:bg-red-500",
                    "transform scale-x-0 transition-transform duration-300",
                    "group-hover:scale-x-100"
                  )}></span>
                </span>{" "}
                Companies
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={cn(
                  "text-lg sm:text-xl max-w-2xl mx-auto font-medium",
                  "text-gray-700 dark:text-gray-300",
                  "transition-colors duration-300"
                )}
              >
                Discover & Connect with Top RegTech Firms – Explore Insights, Trends
                & Growth Opportunities!
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto w-full"
            >
              <SearchBar />
            </motion.div>

            {/* Country Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-4"
            >
              <p className={cn(
                "text-sm font-medium",
                "text-gray-700 dark:text-gray-300",
                "transition-colors duration-300"
              )}>
                Search Companies by Country
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {countries.map((country) => (
                  <Link
                    key={country.code}
                    href={`/companies?country=${country.name}`}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full",
                      "text-[#AD0000] dark:text-white",
                      "bg-white/90 dark:bg-gray-800/90",
                      "hover:text-white hover:bg-[#AD0000]",
                      "dark:hover:bg-red-700",
                      "border border-[#AD0000]/20 dark:border-white/20",
                      "transition-all duration-300",
                      "hover:scale-105 active:scale-95"
                    )}
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;