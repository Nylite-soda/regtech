import {
  Building2,
  Globe,
  Users,
  Target,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { save } from "@/lib/utils";
import { CompanyService } from "@/types";
import { useState } from "react";

interface Company {
  id: string;
  name: string;
  website: string;
  services: CompanyService[];
  lastFundingDate: string;
  acquisitions: number;
  employees: string;
  niche: string;
  type: string;
  location: string;
  logo: string;
  description?: string;
}

interface CompanyCardProps {
  company: Company;
  isSearchResult?: boolean;
}

export default function CompanyCard({
  company,
  isSearchResult = false,
}: CompanyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(company.website, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    save("company", company);
  };

  // Simplified Search Result View with lighter theme - Now Mobile Responsive
  const SearchResultView = () => (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-600 p-4 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Simple accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#AD0000]"></div>

      <div className="flex items-start gap-3 sm:gap-4 pl-2">
        {/* Logo */}
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={56}
              height={56}
              className="object-contain p-1.5"
            />
          ) : (
            <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-gray-400" />
          )}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 pt-0.5 sm:pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-white truncate group-hover:text-[#AD0000] transition-colors text-sm sm:text-base">
              {company.name}
            </h3>

            {/* Simple visible action button */}
            <button
              onClick={handleWebsiteClick}
              className="text-gray-500 hover:text-[#AD0000] transition-colors p-1 sm:p-1.5 rounded-full hover:bg-gray-50 ml-2 flex-shrink-0"
              aria-label="Visit website"
            >
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Company details in a clean grid - Responsive */}
          <div className="mt-1.5 sm:mt-2">
            {/* Mobile view - stacked */}
            <div className="sm:hidden space-y-1.5">
              <div className="flex items-center text-xs text-gray-700">
                <Target className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate font-medium">{company.niche}</span>
              </div>
              <div className="flex items-center text-xs text-gray-700">
                <Users className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate">{company.employees}</span>
              </div>
              <div className="flex items-center text-xs text-gray-700">
                <Building2 className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate">{company.type}</span>
              </div>
              <div className="flex items-center text-xs text-gray-700">
                <Globe className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate">{company.website}</span>
              </div>
            </div>

            {/* Tablet/Desktop - grid */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center text-xs text-gray-700">
                <Target className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate font-medium">{company.niche}</span>
              </div>
              <div className="flex items-center text-xs text-gray-700">
                <Users className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate">{company.employees}</span>
              </div>
              <div className="flex items-center text-xs text-gray-700">
                <Globe className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate">{company.website}</span>
              </div>
              <div className="flex items-center text-xs text-gray-700">
                <Building2 className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
                <span className="truncate">{company.type}</span>
              </div>
            </div>
          </div>

          {/* Services section - always visible */}
          <div className="mt-1.5 sm:mt-2 flex items-center text-xs text-gray-700">
            <Briefcase className="h-3 w-3 mr-1.5 text-[#AD0000] flex-shrink-0" />
            <div className="truncate font-medium">
              {company.services && company.services.length > 0 ? (
                <>
                  {company.services.slice(0, 2).map((service, idx) => (
                    <span key={idx} className="inline-block">
                      {idx > 0 && <span className="mx-1 text-gray-400">•</span>}
                      {service.name}
                    </span>
                  ))}
                  {company.services.length > 2 && (
                    <span className="ml-1 text-[#AD0000]">
                      +{company.services.length - 2}
                    </span>
                  )}
                </>
              ) : (
                <div>No services added</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile/Tablet Card View
  const CardView = () => (
    <div className="md:hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={48}
                height={48}
                className="object-contain p-1.5"
              />
            ) : (
              <Building2 className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {company.name}
            </h3>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <Globe className="h-4 w-4 mr-2.5 text-[#AD0000] flex-shrink-0" />
            <span className="truncate">{company.website}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2.5 text-[#AD0000] flex-shrink-0" />
            <span>{company.employees} employees</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Target className="h-4 w-4 mr-2.5 text-[#AD0000] flex-shrink-0" />
            <span>{company.niche}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2.5 text-[#AD0000] flex-shrink-0" />
            <span className="truncate">
              {(() => {
                const services = company.services
                  .map((service) => service.name)
                  .join(", ");
                return services.length > 20
                  ? `${services.slice(0, 20)}...`
                  : services;
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Table View
  const TableView = () => (
    <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_80px] items-center px-5 py-3 bg-white">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden dark:!bg-[#fcf8f8] bg-gray-50 flex items-center justify-center">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={40}
              height={40}
              className="object-contain rounded-lg p-1"
            />
          ) : (
            <Building2 className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-sm text-gray-900 flex flex-wrap">
            {company.name}
          </h3>
        </div>
      </div>
      <div className="text-center truncate text-sm text-gray-600">
        {company.niche}
      </div>
      <div className="text-center truncate text-sm text-gray-600">
        {(() => {
          const services = company.services
            .map((service) => service.name)
            .join(", ");
          return services.length > 20
            ? `${services.slice(0, 20)}...`
            : services;
        })()}
      </div>
      <div className="text-center text-sm text-gray-600">
        {company.employees}{" "}
      </div>
      <div className="lg:text-center truncate text-sm text-gray-600">
        {company.website}
      </div>
      <div className="text-right">
        <span className="text-sm font-medium text-[#AD0000]">View →</span>
      </div>
    </div>
  );

  // If isSearchResult is true, render the search result view
  if (isSearchResult) {
    return (
      <Link
        href={`/companies/${company.id}`}
        onClick={handleCardClick}
        className="block"
        suppressHydrationWarning
      >
        <SearchResultView />
      </Link>
    );
  }

  // Otherwise render the standard view
  return (
    <Link
      href={`/companies/${company.id}`}
      className="block border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
      onClick={handleCardClick}
      suppressHydrationWarning
    >
      <CardView />
      <TableView />
    </Link>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="p-4 border border-gray-700/15 drop-shadow-xl rounded-md animate-pulse bg-gray-100">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>{" "}
      {/* Company name */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div> {/* Niche */}
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>{" "}
      {/* Services */}
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div> {/* Size */}
      <div className="h-4 bg-gray-300 rounded w-1/5"></div> {/* Website */}
    </div>
  );
}
