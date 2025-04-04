'use client';

import { useState } from 'react';
import { Search, Filter, Building2, Globe, Users, Target, Briefcase, Banknote } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';
import CompanyFilters from '@/components/CompanyFilters';

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    size: '',
    service: '',
  });

  // Mock data - replace with actual data fetching
  const companies = [
    {
      id: 1,
      name: 'RegTech Solutions',
      website: 'https://regtech.com',
      services: ['AML', 'Compliance', 'KYC'],
      lastFundingDate: '2023-12-15',
      acquisitions: 3,
      employees: 150,
      niche: 'AML',
      type: 'Private',
      location: 'South Africa',
      logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS', // Updated placeholder URL
    },
    {
      id: 2,
      name: 'ComplianceTech Africa',
      website: 'https://compliancetech.africa',
      services: ['Compliance', 'Regulatory'],
      lastFundingDate: '2023-11-20',
      acquisitions: 1,
      employees: 75,
      niche: 'Compliance',
      type: 'Private',
      location: 'Nigeria',
      // No logo provided, will show fallback icon
    },
    {
      id: 3,
      name: 'AML Shield',
      website: 'https://amlshield.com',
      services: ['AML', 'KYC'],
      lastFundingDate: '2023-10-05',
      acquisitions: 0,
      employees: 200,
      niche: 'AML',
      type: 'Private',
      location: 'Kenya',
      logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=AS', // Updated placeholder URL
    },
    {
      id: 4,
      name: 'RegTech Solutions',
      website: 'https://regtech.com',
      services: ['AML', 'Compliance', 'KYC'],
      lastFundingDate: '2023-12-15',
      acquisitions: 3,
      employees: 150,
      niche: 'AML',
      type: 'Private',
      location: 'South Africa',
      logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS', // Updated placeholder URL
    },
    {
      id: 5,
      name: 'ComplianceTech Africa',
      website: 'https://compliancetech.africa',
      services: ['Compliance', 'Regulatory'],
      lastFundingDate: '2023-11-20',
      acquisitions: 1,
      employees: 75,
      niche: 'Compliance',
      type: 'Private',
      location: 'Nigeria',
      // No logo provided, will show fallback icon
    },
    {
      id: 6,
      name: 'AML Shield',
      website: 'https://amlshield.com',
      services: ['AML', 'KYC'],
      lastFundingDate: '2023-10-05',
      acquisitions: 0,
      employees: 200,
      niche: 'AML',
      type: 'Private',
      location: 'Kenya',
      logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=AS', // Updated placeholder URL
    },
    {
      id: 7,
      name: 'RegTech Solutions',
      website: 'https://regtech.com',
      services: ['AML', 'Compliance', 'KYC'],
      lastFundingDate: '2023-12-15',
      acquisitions: 3,
      employees: 150,
      niche: 'AML',
      type: 'Private',
      location: 'South Africa',
      logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS', // Updated placeholder URL
    },
    {
      id: 8,
      name: 'ComplianceTech Africa',
      website: 'https://compliancetech.africa',
      services: ['Compliance', 'Regulatory'],
      lastFundingDate: '2023-11-20',
      acquisitions: 1,
      employees: 75,
      niche: 'Compliance',
      type: 'Private',
      location: 'Nigeria',
      // No logo provided, will show fallback icon
    },
    {
      id: 9,
      name: 'AML Shield',
      website: 'https://amlshield.com',
      services: ['AML', 'KYC'],
      lastFundingDate: '2023-10-05',
      acquisitions: 0,
      employees: 200,
      niche: 'AML',
      type: 'Private',
      location: 'Kenya',
      logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=AS', // Updated placeholder URL
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-32">
      {/* Hero Section */}
      <div className="bg-[#AD0000] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Explore Companies</h1>
          <p className="text-xl opacity-90">
            Discover and connect with leading RegTech companies across Africa
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
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
                />
              </div>
            </div>
            <CompanyFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" suppressHydrationWarning>
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
}
