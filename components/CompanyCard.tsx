import {
  Building2,
  Globe,
  Users,
  Target,
  Briefcase,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { save } from "@/lib/utils";
import { CompanyService } from "@/types";

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
}

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(company.website, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    save("company", company);
  };

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
        <span className="text-sm font-medium text-[#AD0000]">View →</span>
      </div>
    </div>
  );

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
