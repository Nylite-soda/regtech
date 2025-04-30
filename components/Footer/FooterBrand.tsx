import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterBrandProps {
  companyData: string;
  handleCompanyCreation: () => void;
}

const FooterBrand = ({ companyData, handleCompanyCreation }: FooterBrandProps) => {
  return (
    <div className="flex flex-col w-full lg:max-w-md items-start pb-4 gap-6 animate-in slide-in-from-left duration-500">
      <div className="flex flex-col items-start gap-4 w-full group">
        <h2 className={cn(
          "font-bold text-gray-900 dark:text-white text-3xl md:text-4xl",
          "tracking-tight leading-tight transition-colors duration-300"
        )}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 dark:from-red-500 dark:to-red-700">
            Regtech Horizon
          </span>
        </h2>
        
        <p className={cn(
          "w-full font-medium text-gray-600 dark:text-gray-300",
          "text-lg tracking-normal leading-relaxed transition-colors duration-300"
        )}>
          Discover Africa's Leading RegTech Companies
        </p>
      </div>

      <Button 
        onClick={handleCompanyCreation}
        className={cn(
          "bg-gradient-to-r from-slate-900 to-slate-800 text-white",
          "dark:from-red-700 dark:to-red-900 hover:from-red-700 hover:to-red-900",
          "dark:hover:from-red-800 dark:hover:to-red-950",
          "rounded-xl px-6 py-6 h-auto group relative overflow-hidden",
          "transition-all duration-300 shadow-lg hover:shadow-xl"
        )}
        suppressHydrationWarning
      >
        <span className="font-semibold text-base flex items-center gap-2">
          {companyData ? "Create Company" : "Sign Up to Create Company"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </Button>
    </div>
  );
};

export default FooterBrand;