import { Building2, Globe, Users, Target, Briefcase, Banknote } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { save } from '@/lib/utils';

interface Company {
  id: number;
  name: string;
  website: string;
  services: string;
  lastFundingDate: string;
  acquisitions: number;
  employees: String;
  niche: string;
  type: string;
  location: string;
  logo?: string; // Optional logo URL
}

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`} className="block h-full" suppressHydrationWarning>
      <button 
              onClick={(e) => {
                save("company", company)
              }}>
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-300 h-full flex flex-col">
          <div className="p-4 sm:p-6 flex flex-col flex-grow">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              {/* Logo/Avatar Section */}
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={64}
                    height={64}
                    className="rounded-lg object-contain"
                  />
                ) : (
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                )}
              </div>
              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate hover:text-[#AD0000] transition-colors">
                  {company.name}
                </h3>
                <span className="px-2 py-1 text-xs sm:text-sm rounded-full bg-[#AD0000] text-white inline-block mt-1">
                  {company.type}
                </span>
              </div>
            </div>
            <div className="space-y-3 grid md:grid-cols-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(company.website, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center text-gray-600 hover:text-[#AD0000] transition-colors text-sm sm:text-base p-0 h-auto justify-start"
                suppressHydrationWarning
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">{company.website}</span>
              </button>
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">{company.niche}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>{company.employees} employees</span>
              </div>
              <div className="flex items-start text-gray-600 text-sm sm:text-base">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-1" />
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span
                      className="px-2 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full bg-gray-100"
                    >
                      {company.services}
                    </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <Banknote className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Last funding: {company.lastFundingDate}</span>
              </div>
              {company.acquisitions > 0 && (
                <div className="flex items-center text-gray-600 text-sm sm:text-base">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>{company.acquisitions} acquisitions</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </button>
    </Link>
  );
} 