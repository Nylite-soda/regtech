'use client';

import { useState } from 'react';
import { Search, Filter, Building2, Globe, Users, Target, Briefcase, Banknote } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';
import CompanyFilters from '@/components/CompanyFilters';
import { useEffect } from 'react';
import { BASE_URL } from "@/lib/utils";
import Link from 'next/link';

interface Company {
  id: number;
  name: string;
  website: string;
  services: string;
  lastFundingDate: string;
  acquisitions: number;
  employees: string;
  niche: string;
  type: string;
  location: string;
  logo: string;
}
export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    size: '',
    service: '',
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/company/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        // You can set an error state here if you want to show an error message to the user
      }
    };
    fetchCompanies();
  }, []);
  // Mock data - replace with actual data fetching
  // const companies = [
  //   {
  //     id: 1,
  //     name: 'RegTech Solutions',
  //     website: 'https://regtech.com',
  //     services: ['AML', 'Compliance', 'KYC'],
  //     lastFundingDate: '2023-12-15',
  //     acquisitions: 3,
  //     employees: 150,
  //     niche: 'AML',
  //     type: 'Private',
  //     location: 'South Africa',
  //     logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS', // Updated placeholder URL
  //   },
  //   {
  //     id: 2,
  //     name: 'ComplianceTech Africa',
  //     website: 'https://compliancetech.africa',
  //     services: ['Compliance', 'Regulatory'],
  //     lastFundingDate: '2023-11-20',
  //     acquisitions: 1,
  //     employees: 75,
  //     niche: 'Compliance',
  //     type: 'Private',
  //     location: 'Nigeria',
  //     // No logo provided, will show fallback icon
  //   },
  //   {
  //     id: 3,
  //     name: 'AML Shield',
  //     website: 'https://amlshield.com',
  //     services: ['AML', 'KYC'],
  //     lastFundingDate: '2023-10-05',
  //     acquisitions: 0,
  //     employees: 200,
  //     niche: 'AML',
  //     type: 'Private',
  //     location: 'Kenya',
  //     logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=AS', // Updated placeholder URL
  //   },
  //   {
  //     id: 4,
  //     name: 'RegTech Solutions',
  //     website: 'https://regtech.com',
  //     services: ['AML', 'Compliance', 'KYC'],
  //     lastFundingDate: '2023-12-15',
  //     acquisitions: 3,
  //     employees: 150,
  //     niche: 'AML',
  //     type: 'Private',
  //     location: 'South Africa',
  //     logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS', // Updated placeholder URL
  //   },
  //   {
  //     id: 5,
  //     name: 'ComplianceTech Africa',
  //     website: 'https://compliancetech.africa',
  //     services: ['Compliance', 'Regulatory'],
  //     lastFundingDate: '2023-11-20',
  //     acquisitions: 1,
  //     employees: 75,
  //     niche: 'Compliance',
  //     type: 'Private',
  //     location: 'Nigeria',
  //     // No logo provided, will show fallback icon
  //   },
  //   {
  //     id: 6,
  //     name: 'AML Shield',
  //     website: 'https://amlshield.com',
  //     services: ['AML', 'KYC'],
  //     lastFundingDate: '2023-10-05',
  //     acquisitions: 0,
  //     employees: 200,
  //     niche: 'AML',
  //     type: 'Private',
  //     location: 'Kenya',
  //     logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=AS', // Updated placeholder URL
  //   },
  //   {
  //     id: 7,
  //     name: 'RegTech Solutions',
  //     website: 'https://regtech.com',
  //     services: ['AML', 'Compliance', 'KYC'],
  //     lastFundingDate: '2023-12-15',
  //     acquisitions: 3,
  //     employees: 150,
  //     niche: 'AML',
  //     type: 'Private',
  //     location: 'South Africa',
  //     logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS', // Updated placeholder URL
  //   },
  //   {
  //     id: 8,
  //     name: 'ComplianceTech Africa',
  //     website: 'https://compliancetech.africa',
  //     services: ['Compliance', 'Regulatory'],
  //     lastFundingDate: '2023-11-20',
  //     acquisitions: 1,
  //     employees: 75,
  //     niche: 'Compliance',
  //     type: 'Private',
  //     location: 'Nigeria',
  //     // No logo provided, will show fallback icon
  //   },
  //   {
  //     id: 9,
  //     name: 'AML Shield',
  //     website: 'https://amlshield.com',
  //     services: ['AML', 'KYC'],
  //     lastFundingDate: '2023-10-05',
  //     acquisitions: 0,
  //     employees: 200,
  //     niche: 'AML',
  //     type: 'Private',
  //     location: 'Kenya',
  //     logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=AS', // Updated placeholder URL
  //   },
  // ];

  return (
    <div className="min-h-screen bg-white pt-32">
      {/* Hero Section */}
      <div className="bg-[#AD0000] text-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Explore Companies</h1>
              <p className="text-lg md:text-xl opacity-90">
                Discover and connect with leading RegTech companies across Africa
              </p>
            </div>
            <Link 
              href="/auth/company/register" 
              className="w-full md:w-auto bg-white text-[#AD0000] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              List a Company
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Search and Filters */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
            </div>
            <CompanyFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid gap-4 md:gap-6" suppressHydrationWarning>
        <div className="hidden md:grid md:grid-cols-[1fr_100px_1fr_1fr_1fr_60px] items-center px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="text-left font-medium text-sm text-gray-700">Company</div>
                <div className="text-center font-medium text-sm text-gray-700">Niche</div>
                <div className="text-center font-medium text-sm text-gray-700">Services</div>
                <div className="text-center font-medium text-sm text-gray-700">Size</div>
                <div className="font-medium text-sm text-gray-700">Website</div>
                <div></div>
              </div>
          {companies.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-xl text-gray-600">No Companies Listed yet</p>
            </div>
          ) : (
            companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
