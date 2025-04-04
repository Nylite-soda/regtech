"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on home page
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 p-2 hover:cursor-pointer rounded-full bg-white/80 hover:bg-[#AD0000] hover:text-white shadow-md transition-all duration-200 z-50"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
} 