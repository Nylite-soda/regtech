import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FooterSocialLinks from "./FooterSocialLinks";

const FooterBottom = () => {
  return (
    <div className="flex flex-col items-start gap-5 pt-8 w-full animate-in fade-in duration-700 delay-300">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-2" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-6 py-4">
        <FooterSocialLinks />

        <div className="flex flex-wrap lg:flex-nowrap items-center gap-y-4 gap-x-6 w-full md:w-auto md:justify-end text-gray-700 dark:text-gray-300">
          <p className="font-medium text-sm md:text-base tracking-normal leading-relaxed opacity-90">
            © Regtech Horizon 2025. All rights reserved
          </p>
          
          <FooterDot />
          
          <Link
            href="/terms"
            className={cn(
              "font-medium text-sm md:text-base tracking-normal",
              "text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500",
              "transition-colors duration-200"
            )}
          >
            Terms of Service
          </Link>
          
          <FooterDot />
          
          <Link
            href="/privacy"
            className={cn(
              "font-medium text-sm md:text-base tracking-normal",
              "text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500",
              "transition-colors duration-200"
            )}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

const FooterDot = () => (
  <span className="hidden md:block text-gray-400 dark:text-gray-600">•</span>
);

export default FooterBottom;