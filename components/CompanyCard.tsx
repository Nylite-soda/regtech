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

  // Refined Search Result View
  const SearchResultView = () => (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clean accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-red-800 transition-all duration-300"></div>

      {/* Top decoration line - reveals on hover */}
      <div
        className={`absolute top-0 left-1 right-0 h-0.5 bg-gradient-to-l from-red-800 to-transparent transition-all duration-300 ${
          isHovered ? "opacity-30 w-full" : "opacity-0 w-1/4"
        }`}
      ></div>

      <div className="flex items-start gap-4 pl-2">
        {/* Logo with elegant hover effect */}
        <div
          className={`relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "shadow-md -translate-y-0.5" : ""
          }`}
        >
          {/* Border effect that reveals on hover */}
          <div
            className={`absolute inset-0 border transition-colors duration-300 rounded-lg ${
              isHovered ? "border-red-800" : "border-transparent"
            }`}
          ></div>
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={56}
              height={56}
              className="object-contain p-1.5"
            />
          ) : (
            <Building2 className="h-7 w-7 text-gray-400" />
          )}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-black truncate group-hover:text-red-800 transition-colors duration-300">
              {company.name}
            </h3>

            {/* Action buttons that slide in on hover */}
            <div
              className={`flex items-center gap-2 transition-all duration-300 ${
                isHovered
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0"
              }`}
            >
              <button
                onClick={handleWebsiteClick}
                className="text-gray-600 hover:text-red-800 transition-colors p-1.5 rounded-full hover:bg-gray-50"
                aria-label="Visit website"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Company details in a clean grid */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center text-xs text-gray-700">
              <Target
                className={`h-3 w-3 mr-1.5 transition-colors duration-300 ${
                  isHovered ? "text-red-800" : "text-gray-400"
                }`}
              />
              <span className="truncate font-medium">{company.niche}</span>
            </div>
            <div className="flex items-center text-xs text-gray-700">
              <Users
                className={`h-3 w-3 mr-1.5 transition-colors duration-300 ${
                  isHovered ? "text-red-800" : "text-gray-400"
                }`}
              />
              <span className="truncate">{company.employees}</span>
            </div>

            {/* Website info */}
            <div className="flex items-center text-xs text-gray-700">
              <Globe
                className={`h-3 w-3 mr-1.5 transition-colors duration-300 ${
                  isHovered ? "text-red-800" : "text-gray-400"
                }`}
              />
              <span className="truncate">{company.website}</span>
            </div>

            {/* Type info */}
            <div className="flex items-center text-xs text-gray-700">
              <Building2
                className={`h-3 w-3 mr-1.5 transition-colors duration-300 ${
                  isHovered ? "text-red-800" : "text-gray-400"
                }`}
              />
              <span className="truncate">{company.type}</span>
            </div>
          </div>

          {/* Services section with smooth reveal animation */}
          <div
            className={`mt-2 flex items-center text-xs text-gray-700 transition-all duration-300 ${
              isHovered ? "max-h-6 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <Briefcase className="h-3 w-3 mr-1.5 text-red-800 flex-shrink-0" />
            <div className="truncate font-medium">
              {company.services.slice(0, 3).map((service, idx) => (
                <span key={idx} className="inline-block">
                  {idx > 0 && <span className="mx-1 text-gray-400">•</span>}
                  {service.name}
                </span>
              ))}
              {company.services.length > 3 && (
                <span className="ml-1 text-red-800">
                  +{company.services.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration line - expands on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-l from-red-800 to-transparent transition-all duration-300 ${
          isHovered ? "opacity-30 w-full" : "opacity-0 w-1/4"
        }`}
      ></div>

      {/* Subtle background glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-tl from-red-800 to-transparent opacity-0 transition-opacity duration-300 ${
          isHovered ? "opacity-5" : ""
        }`}
      ></div>
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
            <Globe className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{company.website}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
            <span>{company.employees} employees</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Target className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
            <span>{company.niche}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
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
        <div className="h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
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
        <span className="text-sm font-medium text-red-800">View →</span>
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
