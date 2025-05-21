"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BASE_URL, cn } from "@/lib/utils";
import { LoadingScreen } from "./ui/loading-screen";
import { Spinner } from "./ui/Spinner";

interface Company {
  id: string;
  name: string;
  niche: string;
  description: string;
  location: string;
  year_founded: number;
  logo: string;
}

export const niches = ["AML", "KYC", "Regulatory", "Compliance", "SupTech"];

const HighlightedSection = () => {
  const [activeNiche, setActiveNiche] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate filtered companies based on active filters
  // Added null check to make sure companies is an array before filtering
  const filteredCompanies = Array.isArray(companies)
    ? companies.filter(
        (company) => !activeNiche || company.niche === activeNiche
      )
    : [];

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Check viewport size
    const checkViewportSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setViewportSize("mobile");
      } else if (width < 1024) {
        setViewportSize("tablet");
      } else {
        setViewportSize("desktop");
      }
    };

    // Initial check for viewport size
    checkViewportSize();

    // Add resize listener for responsive behavior
    window.addEventListener("resize", checkViewportSize);

    const checkScrollPosition = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setIsScrolledToStart(scrollLeft <= 0);
        setIsScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 10);

        // Calculate scroll progress percentage
        const maxScroll = scrollWidth - clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        setScrollProgress(progress);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }

    return () => {
      clearTimeout(animationTimeout);
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
      window.removeEventListener("resize", checkViewportSize);
    };
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/company/all?per_page=7`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (
          result &&
          result.status === "success" &&
          Array.isArray(result.data)
        ) {
          // Map backend data to our component format if needed
          const formattedCompanies = result.data.map((company: any) => ({
            id: company.id || String(Math.random()),
            name: company.name || "Unnamed Company",
            niche: company.niche || "Other",
            description: company.description || "No description available",
            location: company.headquarters || "Unknown",
            year_founded: company.year_founded || null,
            logo: company.logo || "/images/logos/placeholder-logo.svg", // Fallback logo
          }));
          setCompanies(formattedCompanies);
        } else {
          console.error("Invalid API response:", result);
          setError("Failed to load companies - Invalid data format");
        }
      } catch (err) {
        console.error("API fetch error:", err);
        setError("An error occurred while fetching companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      // Calculate scroll amount based on container width
      const scrollAmount =
        direction === "left" ? -containerWidth * 0.8 : containerWidth * 0.8;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      handleScroll("left");
    } else if (event.key === "ArrowRight") {
      handleScroll("right");
    }
  };

  return (
    <section
      className="w-full py-10 lg:py-16 pb-20 mx-auto mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Company highlights section"
    >
      <div
        className={cn(
          "flex flex-col gap-8",
          "animate-in fade-in-50 duration-1000"
        )}
      >
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              "inline-flex items-center px-4 sm:px-6 py-2 sm:py-3",
              "bg-gradient-to-r from-red-600 to-red-800",
              "dark:from-red-500 dark:to-red-700",
              "rounded-tr-2xl rounded-bl-2xl",
              "shadow-lg",
              "w-fit",
              "transform transition-all duration-500 hover:scale-103",
              "group"
            )}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
              <span className="inline-block group-hover:animate-pulse">
                Highlighted Companies
              </span>
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-300 ml-2 max-w-xl">
            Discover innovative companies across Africa making a difference in
            various sectors.
          </p>
        </div>

        {/* Categories and Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              Categories:
            </span>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button
                variant="outline"
                onClick={() => setActiveNiche(null)}
                className={cn(
                  "rounded-xl border-2 font-medium text-xs sm:text-sm",
                  "transition-all duration-300 transform",
                  "hover:scale-105 active:scale-95",
                  !activeNiche
                    ? "border-red-600 bg-red-600/10 text-red-600 dark:border-red-500 dark:bg-red-500/10 dark:text-red-500 font-semibold"
                    : "border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500"
                )}
              >
                All
              </Button>
              {niches.map((niche) => (
                <Button
                  key={niche}
                  variant="outline"
                  onClick={() =>
                    setActiveNiche(activeNiche === niche ? null : niche)
                  }
                  className={cn(
                    "rounded-xl border-2 font-medium text-xs sm:text-sm",
                    "transition-all duration-300 transform",
                    "hover:scale-105 active:scale-95",
                    activeNiche === niche
                      ? "border-red-600 bg-red-600/10 text-red-600 dark:border-red-500 dark:bg-red-500/10 dark:text-red-500 font-semibold"
                      : "border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500"
                  )}
                >
                  {niche}
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation controls with progress indicator */}
          <div className="flex flex-col gap-2 self-end md:self-auto">
            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 dark:bg-red-500 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <div className="flex gap-3 self-end">
              <Button
                variant="outline"
                onClick={() => handleScroll("left")}
                disabled={isScrolledToStart}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0",
                  "bg-gray-900 dark:bg-gray-800",
                  "border-none text-white",
                  "hover:bg-red-600 dark:hover:bg-red-500",
                  "transition-all duration-300",
                  "hover:scale-105 active:scale-95",
                  "disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-gray-900 dark:disabled:hover:bg-gray-800"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleScroll("right")}
                disabled={isScrolledToEnd}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0",
                  "bg-gray-900 dark:bg-gray-800",
                  "border-none text-white",
                  "hover:bg-red-600 dark:hover:bg-red-500",
                  "transition-all duration-300",
                  "hover:scale-105 active:scale-95",
                  "disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-gray-900 dark:disabled:hover:bg-gray-800"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 py-2 md:pb-14">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <CompanyCardSkeleton key={i} />
              ))}
          </div>
        )}

        {/* Companies List */}
        <div
          ref={containerRef}
          className={cn(
            "flex gap-4 sm:gap-4 overflow-x-auto",
            "scroll-smooth",
            "snap-x snap-mandatory",
            "no-scrollbar",
            "-mx-4 px-4 py-2 md:pb-14"
          )}
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
          aria-label="Companies carousel"
          tabIndex={0}
        >
          {!loading &&
          !error &&
          filteredCompanies &&
          filteredCompanies.length > 0
            ? filteredCompanies.map((company, index) => (
                <Card
                  key={company.id || index}
                  className={cn(
                    "min-w-[320px] w-[320px] sm:w-[360px] md:w-[380px] lg:w-[400px] shrink-0",
                    "snap-center",
                    "border border-gray-200 dark:border-gray-800",
                    "bg-white dark:bg-gray-900",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300 transform",
                    "hover:scale-[1.01]",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4",
                    "focus-within:ring-2 focus-within:ring-red-600 dark:focus-within:ring-red-500 focus-within:ring-opacity-50"
                  )}
                  style={{
                    transitionDelay: `${index * 75}ms`,
                  }}
                >
                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 relative flex flex-col min-h-[330px]">
                    {/* Header - Logo, Title, Niche */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={cn(
                          "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24",
                          "rounded-2xl overflow-hidden",
                          "border border-gray-200 dark:border-gray-700",
                          "bg-gray-100 dark:!bg-[#fcf8f8]",
                          "transition-transform duration-500",
                          "hover:rotate-4 hover:scale-102",
                          "group-hover:rotate-3 group-hover:scale-105"
                        )}
                      >
                        <img
                          src={
                            company.logo || "/images/logos/placeholder-logo.svg"
                          }
                          alt={`${company.name} logo`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.src =
                              "/images/logos/placeholder-logo.svg";
                          }}
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h3
                          className={cn(
                            "text-lg sm:text-xl md:text-2xl font-semibold",
                            "text-gray-900 dark:text-white"
                          )}
                        >
                          {company.name || "Unnamed Company"}
                        </h3>
                        <div className="text-sm px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 inline-block">
                          {company.niche || "Other"}
                        </div>
                      </div>

                      {/* Desktop View Button (hidden on mobile/tablet) */}
                      {viewportSize === "desktop" && (
                        <div>
                          <Link
                            href={`/companies/${company.id}`}
                            id={`company-${company.id}`}
                            aria-label={`View ${company.name} profile`}
                          >
                            <Button
                              className={cn(
                                "bg-gray-900 dark:bg-white",
                                "text-white dark:text-gray-900",
                                "hover:bg-red-600 dark:hover:bg-red-500",
                                "hover:text-white dark:hover:text-white",
                                "transition-all duration-300",
                                "hover:scale-102",
                                "focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:ring-offset-2"
                              )}
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="flex-grow">
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base overflow-hidden relative">
                        {company.description &&
                        company.description.length > 120 ? (
                          <>
                            <span className="line-clamp-3">
                              {company.description}
                            </span>
                            <span className="absolute bottom-0 right-0 bg-gradient-to-l from-white dark:from-[#121212] to-transparent w-16 h-full pointer-events-none"></span>
                          </>
                        ) : (
                          company.description || "No description available"
                        )}
                      </p>
                    </div>

                    {/* Company Details - Location and Founded */}
                    <div className="flex items-center gap-4 sm:gap-6 mt-auto">
                      <div className="space-y-1 max-w-[50%]">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Location
                        </span>
                        <p className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm">
                          {company.location || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Founded
                        </span>
                        <p className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm">
                          {company.year_founded || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Mobile/Tablet View Button (hidden on desktop) */}
                    {viewportSize !== "desktop" && (
                      <div className="w-full mt-4 flex justify-end">
                        <Link
                          href={`/companies/${company.id}`}
                          id={`company-${company.id}-mobile`}
                          className="w-full"
                          aria-label={`View ${company.name} profile`}
                        >
                          <Button
                            className={cn(
                              "bg-gray-900 dark:bg-white",
                              "text-white dark:text-gray-900",
                              "hover:bg-red-600 dark:hover:bg-red-500",
                              "hover:text-white dark:hover:text-white",
                              "transition-all duration-300",
                              "hover:scale-102",
                              "w-full",
                              "focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 focus:ring-offset-2"
                            )}
                          >
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            : !loading && (
                <div className="w-full flex items-center justify-center py-10">
                  <div className="text-center space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      {error
                        ? "Error loading companies"
                        : "No companies found with the current filters."}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveNiche(null);
                        window.location.reload();
                      }}
                      className="border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-950/20"
                    >
                      {error ? "Try Again" : "Reset Filters"}
                    </Button>
                  </div>
                </div>
              )}
        </div>
      </div>
    </section>
  );
};

export default HighlightedSection;
const CompanyCardSkeleton = () => {
  return (
    <div className="min-w-[320px] w-[320px] sm:w-[360px] md:w-[380px] lg:w-[400px] shrink-0 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
};
