"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const companies = [
  {
    id: 1,
    name: "PaySwift",
    category: "Fintech & Payments",
    description:
      "PaySwift is a seamless payment processing platform that enables businesses to accept online and offline transactions with secure, instant settlements.",
    location: "Nairobi, Kenya",
    founded: "2018",
    rating: "4.7",
    logo: "/images/image-1.png",
  },
  {
    id: 2,
    name: "MediLink",
    category: "HealthTech",
    description:
      "MediLink connects patients with top healthcare providers, offering telemedicine, electronic health records, and AI-powered diagnostics for improved healthcare access.",
    location: "Cape Town, South Africa",
    founded: "2020",
    rating: "4.6",
    logo: "/images/image-3.png",
  },
  {
    id: 3,
    name: "AgriTech Solutions",
    category: "Agriculture & AgriTech",
    description:
      "AgriTech Solutions leverages AI and IoT to optimize farming efficiency, reduce waste, and provide real-time insights for better crop management.",
    location: "Accra, Ghana",
    founded: "2015",
    rating: "4.4",
    logo: "/images/image-1.png",
  },
  {
    id: 4,
    name: "EduPro",
    category: "EdTech",
    description:
      "EduPro is a personalized e-learning platform that provides interactive courses, AI tutors, and skill-based training programs for students and professionals.",
    location: "Abuja, Nigeria",
    founded: "2019",
    rating: "4.8",
    logo: "/images/image-3.png",
  },
  {
    id: 5,
    name: "EcoCharge",
    category: "Renewable Energy",
    description:
      "EcoCharge provides affordable solar and renewable energy solutions, helping households and businesses reduce carbon footprints and achieve energy independence.",
    location: "Kigali, Rwanda",
    founded: "2016",
    rating: "4.7",
    logo: "/images/image-1.png",
  },
];

const categories = ["AML", "KYC", "Regulatory", "Compliance", "SupTech"];

const HighlightedSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('companies-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -630 : 630;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <section className="w-full py-10 lg:py-16 pb-20 mx-auto mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className={cn(
        "flex flex-col gap-8",
        "animate-in fade-in-50 duration-1000"
      )}>
        {/* Header */}
        <div className={cn(
          "inline-flex items-center px-6 py-3",
          "bg-gradient-to-r from-red-600 to-red-800",
          "dark:from-red-500 dark:to-red-700",
          "rounded-tr-2xl rounded-bl-2xl",
          "shadow-lg",
          "w-fit"
        )}>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Highlighted Companies
          </h2>
        </div>

        {/* Categories and Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              Categories:
            </span>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  className={cn(
                    "rounded-xl border-2 font-medium",
                    "transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    activeCategory === category
                      ? "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-500"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleScroll('left')}
              className={cn(
                "w-12 h-12 rounded-full p-0",
                "bg-gray-900 dark:bg-gray-800",
                "border-none text-white",
                "hover:bg-red-600 dark:hover:bg-red-500",
                "transition-all duration-300",
                "hover:scale-110 active:scale-95"
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleScroll('right')}
              className={cn(
                "w-12 h-12 rounded-full p-0",
                "bg-gray-900 dark:bg-gray-800",
                "border-none text-white",
                "hover:bg-red-600 dark:hover:bg-red-500",
                "transition-all duration-300",
                "hover:scale-110 active:scale-95"
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Companies List */}
        <div 
          id="companies-container"
          className={cn(
            "flex gap-6 overflow-x-auto pb-8",
            "scroll-smooth scrollbar-hide",
            "snap-x snap-mandatory",
            "no-scrollbar"
          )}
        >
          {companies.map((company) => (
            <Card
              key={company.id}
              className={cn(
                "w-[325px] md:w-[630px] shrink-0",
                "snap-center",
                "border border-gray-200 dark:border-gray-800",
                "bg-white dark:bg-gray-900",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300",
                "hover:scale-[1.01]",
                "animate-in fade-in-50 duration-400"
              )}
            >
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-24 h-24 md:w-28 md:h-28",
                      "rounded-2xl overflow-hidden",
                      "border-2 border-gray-200 dark:border-gray-700"
                    )}>
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className={cn(
                        "text-2xl md:text-3xl font-semibold",
                        "text-gray-900 dark:text-white"
                      )}>
                        {company.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {company.category}
                      </p>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {company.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/companies/${company.id}`}>
                    <Button
                      className={cn(
                        "bg-gray-900 dark:bg-white",
                        "text-white dark:text-gray-900",
                        "hover:bg-red-600 dark:hover:bg-red-500",
                        "hover:text-white dark:hover:text-white",
                        "transition-all duration-300",
                        "hover:scale-105"
                      )}
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>

                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  {company.description}
                </p>

                <div className="flex items-center gap-6 pt-4">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {company.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Founded
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {company.founded}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightedSection;