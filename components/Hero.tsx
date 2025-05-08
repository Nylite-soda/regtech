"use client";
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BASE_URL, cn } from "@/lib/utils";
import { Search, X, Clock, Loader2, Building, MapPin, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/toast-context";
import CompanyCard from "./CompanyCard";
import { CompanyService } from "@/types";
import _ from "lodash";
import { Virtuoso } from "react-virtuoso";

interface Company {
  id: string;
  name: string;
  website: string;
  services: CompanyService[];
  lastFundingDate: string;
  acquisitions: number;
  employees: string;
  niche: string;
  type: string;
  location: string;
  logo: string;
  description: string;
}

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const revealRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  // Country data
  const countries = [
    { name: "Nigeria", code: "NG" },
    { name: "South Africa", code: "ZA" },
    { name: "Kenya", code: "KE" },
    { name: "Egypt", code: "EG" },
    { name: "Ghana", code: "GH" },
  ];

  // // Create debounced API fetch function
  // const fetchCompanies = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${BASE_URL}/api/v1/company/all`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       credentials: "include",
  //     });

  //     if (!response.ok)
  //       throw new Error(`HTTP error! status: ${response.status}`);

  //     const { data } = await response.json();

  //     // Add sample descriptions for improved UI if they don't exist
  //     const enhancedData = data.map((company: Company) => ({
  //       ...company,
  //       description:
  //         company.description ||
  //         `Leading RegTech provider specializing in ${company.niche} solutions.`,
  //     }));

  //     setCompanies(enhancedData);
  //   } catch (error) {
  //     showToast("Failed to load companies", "error");
  //     console.error("Error loading companies:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [showToast]);

  // // Debounced version of fetchCompanies
  // const debouncedFetchCompanies = useCallback(
  //   _.debounce(() => {
  //     fetchCompanies();
  //   }, 300),
  //   [fetchCompanies]
  // );

  // // Fetch companies data
  // useEffect(() => {
  //   if (mounted) {
  //     debouncedFetchCompanies();
  //   }

  //   return () => {
  //     debouncedFetchCompanies.cancel();
  //   };
  // }, [mounted, debouncedFetchCompanies]);

  // Load search history from localStorage
  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing search history:", error);
        // Reset the history if it's corrupted
        localStorage.removeItem("searchHistory");
        setSearchHistory([]);
      }
    }
    setMounted(true);
  }, []);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionsRef.current) {
      const selectedElement =
        suggestionsRef.current.children[selectedSuggestionIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedSuggestionIndex]);

  // Close suggestions when clicking outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mounted]);

  // Mouse effect for background
  useEffect(() => {
    if (!mounted) return;

    const revealElement = revealRef.current;
    if (!revealElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = revealElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const radius = 180;
      revealElement.style.background = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent, var(--reveal-color) 75%)`;
    };

    const handleMouseLeave = () => {
      revealElement.style.background = "var(--reveal-color)";
    };

    window.addEventListener("mousemove", handleMouseMove);
    revealElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      revealElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mounted]);

  // Create debounced search function
  const debouncedSearch = useCallback(
    _.debounce(async (query: string) => {
      if (!query.trim()) {
        setFilteredCompanies([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/public/companies/search?search_term=${encodeURIComponent(
            query.trim()
          )}&per_page=5`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFilteredCompanies(data.data || []);
      } catch (error) {
        console.error("Search error:", error);
        showToast("Search failed", "error");
        setFilteredCompanies([]);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [showToast]
  );

  // Handle search query changes
  useEffect(() => {
    if (!mounted) return;

    if (searchQuery.trim() === "") {
      setFilteredCompanies([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch(searchQuery);

    // Cleanup function
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch, mounted]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update search history
      const updatedHistory = [
        searchQuery.trim(),
        ...searchHistory.filter((item) => item !== searchQuery.trim()),
      ].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

      router.push(
        `/companies?search_term=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handleSuggestionClick = (companyName: string) => {
    setSearchQuery(companyName);
    setShowSuggestions(false);

    // Update search history
    const updatedHistory = [
      companyName,
      ...searchHistory.filter((item) => item !== companyName),
    ].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    router.push(`/companies?search_term=${encodeURIComponent(companyName)}`);
  };

  const handleHistoryItemClick = (item: string) => {
    setSearchQuery(item);

    // Move this item to the top of history
    const updatedHistory = [
      item,
      ...searchHistory.filter((historyItem) => historyItem !== item),
    ].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    // Keep focus on input after selection
    inputRef.current?.focus();

    // Trigger the search
    setIsLoading(true);
    debouncedSearch(item);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredCompanies([]);
    inputRef.current?.focus();
  };

  // Get currently active suggestions (companies or history)
  const getActiveSuggestions = () => {
    if (filteredCompanies.length > 0) {
      return filteredCompanies;
    } else if (searchHistory.length > 0) {
      return searchHistory;
    }
    return [];
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const activeSuggestions = getActiveSuggestions();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        Math.min(prev + 1, activeSuggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      if (filteredCompanies.length > 0) {
        handleSuggestionClick(filteredCompanies[selectedSuggestionIndex].name);
      } else if (searchHistory.length > 0) {
        handleHistoryItemClick(searchHistory[selectedSuggestionIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Helper function to determine if we should show the suggestions dropdown
  const shouldShowSuggestions = () => {
    return (
      showSuggestions &&
      (isLoading ||
        filteredCompanies.length > 0 ||
        (searchHistory.length > 0 && !searchQuery.trim()) ||
        (searchQuery.trim() !== "" &&
          !isLoading &&
          filteredCompanies.length === 0))
    );
  };

  // Calculate dynamic height for Virtuoso component based on number of items
  const calculateVirtuosoHeight = () => {
    // Set base height per item (approx. CompanyCard height)
    const baseItemHeight = 170; // Average height of a company card in pixels
    const maxHeight = 300; // Maximum height in pixels

    // Calculate height based on number of items (minimum of 1 item height)
    const calculatedHeight = Math.min(
      filteredCompanies.length * baseItemHeight,
      maxHeight
    );

    // Return at least enough height for one item, or calculated height
    return Math.max(baseItemHeight, calculatedHeight);
  };

  if (!mounted) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative min-h-[80vh] lg:min-h-screen flex items-center",
        "pt-[100px] lg:pt-10 md:pb-[80px] md:max-h-[1500px]"
      )}
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
    >
      {/* Background Layers (unchanged) */}
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat z-10",
          "transition-opacity duration-500"
        )}
        style={{
          backgroundImage: "url('/images/map-bg.png')",
          filter: "grayscale(100%) brightness(0.8)",
          opacity: 1,
        }}
      />

      <div
        className={cn(
          "dark:hidden absolute inset-0 bg-cover bg-center bg-no-repeat -z-1",
          "bg-[url('/images/map2.png')] transition-opacity duration-500"
        )}
        style={{
          filter: "brightness(0.9)",
          opacity: 1,
        }}
      />

      {/* Pattern Overlay */}
      <div
        className={cn(
          "absolute inset-0 z-15 opacity-30",
          "transition-opacity duration-500"
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(200, 200, 200, 0.8) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(200, 200, 200, 0.1) 2px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />

      {/* Reveal Layer */}
      <div
        ref={revealRef}
        className="absolute inset-0 z-20 pointer-events-none transition-all duration-300"
        style={
          {
            background: "var(--reveal-color)",
            "--reveal-color": "var(--bg-color, rgba(255, 255, 255, 0.2))",
          } as React.CSSProperties
        }
      />

      {/* Gradient Overlays */}
      <div
        className={cn(
          "absolute inset-0 z-50",
          "bg-gradient-to-t from-white/60 via-transparent to-white/20",
          "dark:from-black/90 dark:via-transparent dark:to-black/60",
          "transition-colors duration-500"
        )}
      />

      <div
        className={cn(
          "absolute inset-0 z-50",
          "bg-gradient-to-r from-white/30 via-transparent to-white/30",
          "dark:from-black/80 dark:via-transparent dark:to-black/80",
          "transition-colors duration-500"
        )}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full mx-auto relative z-60"
      >
        <div
          className={cn(
            "max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8",
            "py-16 lg:pt-40 sm:py-24 lg:py-28"
          )}
        >
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
                <span
                  className={cn(
                    "text-[#AD0000] dark:text-red-500 relative inline-block group",
                    "transition-colors duration-300"
                  )}
                >
                  RegTech
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5",
                      "bg-[#AD0000] dark:bg-red-500",
                      "transform scale-x-0 transition-transform duration-300",
                      "group-hover:scale-x-100"
                    )}
                  ></span>
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
                Discover & Connect with Top RegTech Firms – Explore Insights,
                Trends & Growth Opportunities!
              </motion.p>
            </motion.div>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto w-full relative"
              ref={searchRef}
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search by company name, services, location..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                      setSelectedSuggestionIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "w-full px-5 py-4 pr-12 rounded-lg",
                      "text-gray-900 dark:text-white",
                      "bg-white/90 dark:bg-gray-800/90",
                      "border border-gray-300 dark:border-gray-700",
                      "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                      "focus:outline-none focus:ring-2 focus:ring-[#AD0000] dark:focus:ring-red-500",
                      "transition-all duration-300"
                    )}
                    aria-label="Search for RegTech companies"
                    aria-haspopup="listbox"
                    aria-expanded={showSuggestions}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className={cn(
                          "text-gray-500 dark:text-gray-400 hover:text-[#AD0000] dark:hover:text-red-500",
                          "transition-colors duration-300 p-1"
                        )}
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className={cn(
                        "text-gray-500 dark:text-gray-400",
                        "hover:text-[#AD0000] dark:hover:text-red-500",
                        "transition-colors duration-300 p-1"
                      )}
                      aria-label="Search"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Search Suggestions with CompanyCards - Only show when there's content */}
                <AnimatePresence>
                  {shouldShowSuggestions() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "absolute mt-1 w-full rounded-lg",
                        "bg-white dark:bg-gray-800",
                        "border border-gray-300 dark:border-gray-700",
                        "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                        "z-50 overflow-hidden",
                        "pt-2"
                      )}
                    >
                      {isLoading ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                          <p className="mt-2">Searching...</p>
                        </div>
                      ) : filteredCompanies.length > 0 ? (
                        <Virtuoso
                          data={filteredCompanies}
                          totalCount={filteredCompanies.length}
                          itemContent={(index, company) => (
                            <div key={company.id} className="px-2">
                              <CompanyCard
                                company={company}
                                isSearchResult={true}
                              />
                            </div>
                          )}
                          style={{ height: `${calculateVirtuosoHeight()}px` }}
                          components={{
                            List: React.forwardRef<
                              HTMLDivElement,
                              {
                                style?: React.CSSProperties;
                                children?: React.ReactNode;
                              }
                            >(({ style, children }, ref) => (
                              <div
                                ref={ref}
                                style={style}
                                className="space-y-2"
                                role="listbox"
                              >
                                {children}
                              </div>
                            )),
                          }}
                        />
                      ) : searchHistory.length > 0 && !searchQuery.trim() ? (
                        <div>
                          <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Recent Searches
                          </div>
                          <ul
                            className="max-h-60 overflow-auto"
                            role="listbox"
                            ref={suggestionsRef}
                          >
                            {searchHistory.map((item, index) => (
                              <li
                                key={index}
                                onClick={() => handleHistoryItemClick(item)}
                                onMouseEnter={() =>
                                  setSelectedSuggestionIndex(index)
                                }
                                className={cn(
                                  "px-4 py-3 text-left cursor-pointer",
                                  "text-gray-900 dark:text-white",
                                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                                  "border-b border-gray-200 dark:border-gray-700 last:border-0",
                                  "transition-colors duration-200",
                                  selectedSuggestionIndex === index
                                    ? "bg-gray-100 dark:bg-gray-700"
                                    : ""
                                )}
                                role="option"
                                aria-selected={
                                  selectedSuggestionIndex === index
                                }
                              >
                                <div className="font-medium flex items-center">
                                  <Clock className="h-3 w-3 mr-2 text-gray-400" />
                                  {item}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : searchQuery.trim() !== "" && !isLoading ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No matching companies found. Try different keywords or
                          a broader search term.
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>

            {/* Country Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-4"
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  "text-gray-700 dark:text-gray-300",
                  "transition-colors duration-300"
                )}
              >
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
