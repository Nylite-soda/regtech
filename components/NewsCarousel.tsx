"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, Pause, Play } from "lucide-react";
import { Button } from "./ui/button";

const newsItems = [
  {
    title: "RegTech Africa Conference 2025 Announced",
    summary: "Annual gathering of regulatory technology leaders set for Lagos, featuring global experts and innovative solutions.",
    timestamp: "2 hours ago",
  },
  {
    title: "New Compliance Framework for African Fintech",
    summary: "Pan-African regulatory body introduces comprehensive guidelines for fintech operations across the continent.",
    timestamp: "4 hours ago",
  },
  {
    title: "AI in Regulatory Reporting Shows Promise",
    summary: "Study reveals 60% efficiency improvement in compliance processes through AI-powered reporting tools.",
    timestamp: "6 hours ago",
  },
  {
    title: "Digital Currency Regulations Update",
    summary: "African central banks collaborate on unified regulatory approach for digital currencies and assets.",
    timestamp: "8 hours ago",
  },
];

const NewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
      }, 5000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-44 bg-gray-900 text-white flex flex-col relative overflow-hidden  shadow-lg">
      <div className="flex-grow relative overflow-hidden">
        {newsItems.map((item, index) => (
          <div
            key={index}
            className={`absolute w-full h-full px-6 transition-transform duration-500 ease-in-out ${
              index === currentIndex
                ? "translate-y-0"
                : index > currentIndex
                ? "translate-y-full"
                : "-translate-y-full"
            }`}
          >
            <div className="flex flex-col justify-center w-[90%] h-full">
              <h2 className="md:text-2xl text-lg font-bold md:leading-normal leading-5">
                {item.title}
              </h2>
              <p className="text-gray-300 mt-2 mb-3 md:text-sm md:mb-3 md:leading-normal leading-none line-clamp-2">
                {item.summary}
              </p>
              <span className="text-gray-400 text-xs md:text-sm">
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute top-0 h-full right-3 p-2 flex justify-center items-center">
        <div className="flex flex-col space-y-2">
          <Button
            onClick={handlePrevious}
            size="icon"
            className="bg-[#AD0000] text-white hover:bg-[#AD0000]/90 transition"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleNext}
            size="icon"
            className="bg-[#AD0000] text-white hover:bg-[#AD0000]/90 transition"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            onClick={togglePlayPause}
            size="icon"
            className="bg-[#AD0000] text-white hover:bg-[#AD0000]/90 transition"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
        {newsItems.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 mx-1 rounded-full transition-colors duration-300 ${
              index === currentIndex ? "bg-[#AD0000]" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;