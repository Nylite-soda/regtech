"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./button";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on home page
  if (pathname === "/") return null;

  return (
    <Button
      onClick={() => router.back()}
      className="hidden md:block fixed top-35 left-4 p-2 hover:cursor-pointer rounded-full bg-white hover:bg-[#AD0000] hover:text-white shadow-md transition-all duration-200 z-50"
      aria-label="Go back"
      suppressHydrationWarning
    >
      <ArrowLeft className="w-6 h-6" />
    </Button>
  );
} 