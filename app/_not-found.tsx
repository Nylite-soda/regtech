// app/not-found.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="max-w-md w-full">
        {/* Stylish error number with red accent */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold tracking-tighter">404</h1>
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#AD0000] opacity-70 blur-lg"></div>
        </div>

        {/* Error message */}
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Red horizontal line */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#AD0000] to-transparent mb-8"></div>

        {/* Home button with hover effect */}
        <Link href="/" passHref>
          <Button className="w-full py-6 bg-black hover:bg-[#AD0000] text-white border border-[#AD0000] transition-all duration-300 hover:scale-105">
            Return to Home
          </Button>
        </Link>

        {/* Decorative element */}
        <div className="mt-12 flex justify-center">
          <div className="relative">
            <div className="w-2 h-2 bg-[#AD0000] rounded-full"></div>
            <div className="absolute top-0 left-0 w-2 h-2 bg-[#AD0000] rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          <div className="animate-pulse">Loading...</div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
}
