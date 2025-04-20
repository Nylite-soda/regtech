"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/lib/utils";

interface ProfileProgressBarProps {
  companyId: string;
  onComplete?: () => void;
}

export default function ProfileProgressBar({ companyId, onComplete }: ProfileProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const fetchProfileProgress = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;

        const response = await fetch(`${BASE_URL}/api/v1/company/${companyId}/profile-progress`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProgress(data.profile_completion || 0);
          
          // Check if profile is complete (100%)
          if (data.profile_completion === 100 && !isComplete) {
            setIsComplete(true);
            setShowCelebration(true);
            if (onComplete) onComplete();
          }
        }
      } catch (error) {
        console.error("Error fetching profile progress:", error);
      }
    };

    fetchProfileProgress();
  }, [companyId, isComplete, onComplete]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || progress === 100) return null;

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">Complete Your Company Profile</h3>
          <p className="mt-1 text-xs text-gray-500">
            Your profile is {progress}% complete. Complete your profile to unlock all features.
          </p>
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-4 h-8 w-8 flex-shrink-0"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  );
} 