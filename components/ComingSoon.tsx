"use client";

import Link from "next/link";
import React from "react";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center py-40 md:mt-10 bg-white">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-[#AD0000]">Coming Soon</h1>
        <p className="text-gray-600 mt-2 px-10">
          We're working on something amazing. Stay tuned!
        </p>

        <div className="flex justify-center my-6">
          <div className="p-4 bg-[#AD0000] rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-white"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM11 7a1 1 0 112 0v5a1 1 0 01-2 0V7zm1 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Stay updated, we’ll be live soon!
        </p>

        <Link href="/">
          <button className="mt-4 px-6 py-2 text-white bg-black hover:bg-[#AD0000] rounded-md transition-all duration-300 ease-in-out">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}
