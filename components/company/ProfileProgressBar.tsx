"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressItem {
  id: string;
  label: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  section?: string; // Optional: which form section this belongs to
}

export const ProfileProgressBar = ({
  formData,
  className = "",
}: {
  formData: any;
  className?: string;
}) => {
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);

  // Calculate completion status
  useEffect(() => {
    const items: ProgressItem[] = [
      {
        id: "company_name",
        label: "Company name",
        completed: !!formData.company_name,
        priority: "high",
        section: "basic",
      },
      {
        id: "company_email",
        label: "Email address",
        completed: !!formData.company_email,
        priority: "high",
        section: "basic",
      },
      {
        id: "description",
        label: "Company description",
        completed: !!formData.description,
        priority: "high",
        section: "basic",
      },
      {
        id: "logo",
        label: "Company logo",
        completed: !!formData.logo,
        priority: "high",
        section: "basic",
      },
      {
        id: "company_type",
        label: "Company type",
        completed: !!formData.company_type,
        priority: "high",
        section: "details",
      },
      {
        id: "headquarters",
        label: "Headquarters location",
        completed: !!formData.headquarters,
        priority: "high",
        section: "details",
      },
      {
        id: "founders",
        label: "Founder information",
        completed: formData.founder?.length > 0,
        priority: "high",
        section: "details",
      },
      {
        id: "niche",
        label: "Company niche",
        completed: !!formData.niche,
        priority: "high",
        section: "details",
      },
      {
        id: "services",
        label: "Services offered",
        completed: formData.services?.length > 0,
        priority: "high",
        section: "details",
      },
      {
        id: "company_phone",
        label: "Phone number",
        completed: !!formData.company_phone,
        priority: "medium",
        section: "basic",
      },
      {
        id: "company_website",
        label: "Website URL",
        completed: !!formData.company_website,
        priority: "medium",
        section: "basic",
      },
      {
        id: "year_founded",
        label: "Year founded",
        completed: !!formData.year_founded,
        priority: "medium",
        section: "details",
      },
      {
        id: "company_size",
        label: "Company size",
        completed: !!formData.company_size,
        priority: "low",
        section: "details",
      },
      {
        id: "last_funding",
        label: "Last funding date",
        completed: !!formData.last_funding,
        priority: "low",
        section: "details",
      },
      {
        id: "social_media",
        label: "Social media links",
        completed: formData.social_media?.length > 0,
        priority: "low",
        section: "social",
      },
    ];

    setProgressItems(items);

    const completedCount = items.filter((item) => item.completed).length;
    const totalCount = items.length;
    const newProgress = Math.round((completedCount / totalCount) * 100);
    setProgress(newProgress);
  }, [formData]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Highlight the section temporarily
      element.classList.add("ring-2", "ring-blue-500", "rounded-lg");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500", "rounded-lg");
      }, 2000);
    }
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all duration-300 ${
        expanded ? "bg-white shadow-md" : "bg-gray-50"
      } ${className}`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              {/* Foreground progress circle */}
              <path
                d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  progress === 100
                    ? "#10B981"
                    : progress > 75
                    ? "#3B82F6"
                    : progress > 50
                    ? "#F59E0B"
                    : "#EF4444"
                }
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {progress}%
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Profile Completion</h3>
            <p className="text-sm text-gray-500">
              {progress === 100
                ? "Complete!"
                : `${
                    progressItems.filter((i) => !i.completed).length
                  } items remaining`}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-500">
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="border-t p-4 space-y-4 animate-in fade-in">
          <Progress
            value={progress}
            className={`h-2 ${
              progress === 100
                ? "bg-green-500"
                : progress > 75
                ? "bg-blue-500"
                : progress > 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              {progress === 100
                ? "All tasks completed!"
                : `Next steps (${
                    progressItems.filter((i) => !i.completed).length
                  })`}
            </h4>

            <ul className="space-y-2">
              {progressItems
                .filter((item) => !item.completed)
                .sort((a, b) => {
                  const priorityOrder = { high: 1, medium: 2, low: 3 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map((item) => (
                  <li key={item.id} className="flex items-start">
                    <span
                      className={`inline-flex items-center justify-center h-5 w-5 rounded-full mr-2 mt-0.5 ${
                        item.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : item.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <AlertCircle className="h-3 w-3" />
                    </span>
                    <span className="flex-1 text-sm">{item.label}</span>
                    {item.section && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600 h-auto p-0 text-sm"
                        onClick={() => scrollToSection(item.section!)}
                      >
                        Go to section <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </li>
                ))}

              {progress === 100 && (
                <li className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  All required information is complete!
                </li>
              )}
            </ul>
          </div>

          {progress < 100 && (
            <div className="pt-2">
              <p className="text-xs text-gray-500">
                <span className="font-medium">Priority:</span>{" "}
                <span className="text-red-500">High</span> •{" "}
                <span className="text-yellow-500">Medium</span> •{" "}
                <span className="text-gray-500">Low</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileProgressBar;
