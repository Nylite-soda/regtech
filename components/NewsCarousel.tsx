"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, Pause, Play } from "lucide-react";
import { Button } from "./ui/button";

const NewsCarousel = () => {
  // Sample news data
  const newsItems = [
    {
      title: "Breaking: Global Climate Summit Announces Ambitious Targets",
      summary:
        "World leaders gather to discuss critical climate change mitigation strategies.",
      timestamp: "2 hours ago",
    },
    {
      title: "Tech Innovation: AI Breakthrough in Medical Diagnostics",
      summary:
        "New machine learning model shows unprecedented accuracy in disease detection.",
      timestamp: "4 hours ago",
    },
    {
      title: "Economic Outlook: Global Markets Show Resilience",
      summary: "Analysts predict steady growth despite ongoing challenges.",
      timestamp: "6 hours ago",
    },
    {
      title: "Space Exploration: Mars Mission Reaches Milestone",
      summary: "Rover discovers potential signs of ancient microbial activity.",
      timestamp: "8 hours ago",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  let intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
      }, 5000); // Change slide every 5 seconds
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
  }, [isPlaying, newsItems.length]);

  // Navigation handlers
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length
    );
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-44 bg-black text-white flex flex-col self-center relative overflow-hidden">
      {/* News Content */}
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
              <p className="text-white mt-2 mb-3 md:text-sm md:mb-3 md:leading-normal leading-none">
                {item.summary}
              </p>
              <span className="text-gray-300 text-xs md:text-sm">
                {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-0 h-full right-0 p-2 flex justify-center items-center">
        <div className="flex flex-col space-y-2">
          <Button
            onClick={handlePrevious}
            size="icon"
            className="bg-[#AD0000] text-white hover:bg-[#AD0000] transition"
          >
            <ChevronUp />
          </Button>
          <Button
            onClick={handleNext}
            size="icon"
            className="bg-[#AD0000] text-white hover:bg-[#AD0000] transition"
          >
            <ChevronDown />
          </Button>
          <Button
            onClick={togglePlayPause}
            size="icon"
            className="bg-[#AD0000] text-white hover:bg-[#AD0000] transition"
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
        {newsItems.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === currentIndex ? "bg-[#AD0000]" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;
