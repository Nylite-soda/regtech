"use client";

import { X } from "lucide-react";
import Link from "next/link"
import React from "react";
import { Button } from "./ui/button";

export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center py-40 md:mt-10 bg-white">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-black">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          Sorry, you do not have access to this page.
        </p>

        <div className="flex justify-center my-6">
          <div className="p-4 bg-[#AD0000] rounded-full">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 text-white"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9.293 7.293a1 1 0 011.414 0L12 8.586l1.293-1.293a1 1 0 111.414 1.414L13.414 10l1.293 1.293a1 1 0 01-1.414 1.414L12 11.414l-1.293 1.293a1 1 0 11-1.414-1.414L10.586 10 9.293 8.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg> */}
            <X className="text-[#AD0000] bg-white rounded-full w-11 h-11 p-2" />
          </div>
        </div>

        <Link href="/">
          <Button
            onClick={() => (window.location.href = "/")}
            className="mt-4 px-6 py-2 text-white bg-black hover:bg-[#AD0000] hover:cursor-pointer rounded-md transition-all duration-300 ease-in-out"
            suppressHydrationWarning
          >
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
