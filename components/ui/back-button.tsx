"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`hidden md:inline-flex hover:cursor-pointer items-center text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      <span>Back</span>
    </button>
  );
}
