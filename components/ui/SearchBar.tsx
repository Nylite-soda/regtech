"use client";

import { Search, X } from "lucide-react";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search companies...", className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  return (
    <motion.div 
      className={`relative w-full max-w-5xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSearch} className="w-full">
        <div 
          className={`
            relative flex items-center w-full 
            bg-background/95 dark:bg-card/95 backdrop-blur-xl
            rounded-2xl 
            transition-all duration-300 
            ${isFocused ? 'ring-1 ring-white/80 shadow-lg dark:shadow-black/30' : 'shadow-sm hover:shadow-md dark:hover:shadow-black/20'} 
            border border-border/20 dark:border-border/10
            group
          `}
        >
          <div className="absolute left-4 text-muted-foreground/60 group-hover:text-foreground/80 transition-colors duration-300">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="
              w-full pl-12 pr-12 py-4 
              bg-transparent 
              text-foreground/90 placeholder:text-muted-foreground/50
              focus:outline-none focus:ring-0 
              transition-all duration-300 
              text-base
              group-hover:placeholder:text-muted-foreground/70
            "
            placeholder={placeholder}
          />

          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={clearSearch}
                className="
                  absolute right-4 
                  p-1.5 
                  text-muted-foreground/50 hover:text-foreground/80
                  hover:bg-accent/50 dark:hover:bg-accent/20
                  rounded-full 
                  transition-all duration-300
                "
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Search suggestions dropdown - can be implemented later */}
      {/* {isFocused && query && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">Recent searches</div>
            <div className="mt-2 space-y-1">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm">
                AML Compliance
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm">
                KYC Solutions
              </button>
            </div>
          </div>
        </div>
      )} */}
    </motion.div>
  );
};

export default SearchBar;
