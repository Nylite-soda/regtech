"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileCompletionModal({ isOpen, onClose }: ProfileCompletionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti effect when modal opens
      setShowConfetti(true);
      
      // Import confetti library dynamically
      import('canvas-confetti').then((confetti) => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          // Confetti from left side
          confetti.default({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          
          // Confetti from right side
          confetti.default({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold">Congratulations!</DialogTitle>
          <DialogDescription className="text-center">
            Your company profile is now 100% complete. You have unlocked all features of the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-center">
          <div className="flex justify-center mb-4">
            <PartyPopper className="h-12 w-12 text-yellow-500" />
          </div>
          <p className="text-sm text-gray-500">
            Thank you for providing all the necessary information. Your complete profile will help us better serve your needs.
          </p>
        </div>
        <DialogFooter className="flex justify-center">
          <Button onClick={onClose} className="w-full">
            Continue to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 