'use client';

import { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Users, 
  Target, 
  Briefcase, 
  Banknote, 
  Mail, 
  Phone, 
  FileText,
  Star,
  Download,
  Share2,
  Users2,
  Lightbulb,
  Newspaper,
  Building,
  Search
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanyProfile {
  id: number;
  name: string;
  website: string;
  services: Array<{
    name: string;
    description: string;
  }>;
  lastFundingDate: string;
  acquisitions: number;
  employees: number;
  niche: string;
  type: string;
  location: string;
  logo?: string;
  foundedYear: number;
  description: string;
  ratings: {
    average: number;
    count: number;
  };
  documents: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  contact: {
    email: string;
    phone: string;
    social: {
      linkedin?: string;
      twitter?: string;
    };
  };
  founders: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  investments: Array<{
    date: string;
    amount: string;
    type: string;
    investors: string[];
  }>;
}

// Mock data - replace with actual data fetching
const mockCompany: CompanyProfile = {
  id: 1,
  name: 'RegTech Solutions',
  website: 'https://regtech.com',
  services: [
    {
      name: 'AML Solutions',
      description: 'Advanced anti-money laundering solutions with real-time monitoring and reporting.',
    },
    {
      name: 'Compliance Management',
      description: 'Comprehensive compliance management system for regulatory requirements.',
    },
    {
      name: 'KYC Services',
      description: 'Know Your Customer verification and onboarding solutions.',
    },
  ],
  lastFundingDate: '2023-12-15',
  acquisitions: 3,
  employees: 150,
  niche: 'AML',
  type: 'Private',
  location: 'South Africa',
  logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
  foundedYear: 2018,
  description: 'RegTech Solutions is a leading provider of regulatory technology solutions in Africa, helping financial institutions streamline their compliance processes.',
  ratings: {
    average: 4.5,
    count: 128,
  },
  documents: [
    {
      name: 'Company Overview',
      url: '#',
      type: 'PDF',
    },
    {
      name: 'Service Catalog',
      url: '#',
      type: 'PDF',
    },
  ],
  contact: {
    email: 'contact@regtech.com',
    phone: '+27 123 456 789',
    social: {
      linkedin: 'https://linkedin.com/company/regtech',
      twitter: 'https://twitter.com/regtech',
    },
  },
  founders: [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      bio: 'Former compliance officer with 15 years of experience in financial services.',
    },
  ],
  investments: [
    {
      date: '2023-12-15',
      amount: '$10M',
      type: 'Series B',
      investors: ['Venture Capital Fund', 'Strategic Partner'],
    },
  ],
};

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Hero Section */}
      <div className="bg-[#AD0000] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center">
                {mockCompany.logo ? (
                  <Image
                    src={mockCompany.logo}
                    alt={`${mockCompany.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-lg object-contain"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-white/80" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{mockCompany.name}</h1>
                <p className="text-white/80">{mockCompany.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <Link
                href="/search"
                className="hidden px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg md:flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Companies
              </Link>
              <Button 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2"
                suppressHydrationWarning
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
              <Button 
                className="px-4 py-2 bg-white text-[#AD0000] rounded-lg hover:bg-white/90"
                suppressHydrationWarning
              >
                Compare
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-4 md:mb-8">
          <div className="border-b border-gray-200 hidden md:flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-[#AD0000] text-[#AD0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              suppressHydrationWarning
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-[#AD0000] text-[#AD0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              suppressHydrationWarning
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'team'
                  ? 'border-[#AD0000] text-[#AD0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              suppressHydrationWarning
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'investments'
                  ? 'border-[#AD0000] text-[#AD0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              suppressHydrationWarning
            >
              Investments
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-[#AD0000] text-[#AD0000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              suppressHydrationWarning
            >
              Documents
            </button>
          </div>
          <div className='md:hidden'>
            <Select name="content" value={activeTab} onValueChange={(value) => setActiveTab(value)}>
              <SelectTrigger className='w-full text-lg font-semibold py-5 text-[#AD0000]'>
                <SelectValue placeholder="Overview" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="investments">Investments</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-600 mb-6">{mockCompany.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Founded</p>
                      <p className="font-medium">{mockCompany.foundedYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Employees</p>
                      <p className="font-medium">{mockCompany.employees}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Niche</p>
                      <p className="font-medium">{mockCompany.niche}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Funding</p>
                      <p className="font-medium">{mockCompany.lastFundingDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings and Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
                  <Button
                    className="hover:text-[#AD0000] hover:border-[#AD0000] border hover:bg-gray-50"
                    suppressHydrationWarning
                  >
                    Write a Review
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold ml-1">{mockCompany.ratings.average}</span>
                  </div>
                  <div>
                    <p className="text-gray-600">{mockCompany.ratings.count} reviews</p>
                  </div>
                </div>

                {/* Review Placeholder */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to review this company.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a
                      href={`mailto:${mockCompany.contact.email}`}
                      className="text-[#AD0000] hover:underline"
                    >
                      {mockCompany.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${mockCompany.contact.phone}`}
                      className="text-gray-600 hover:text-[#AD0000]"
                    >
                      {mockCompany.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={mockCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AD0000] hover:underline"
                    >
                      {mockCompany.website}
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Social</h3>
                  <div className="flex gap-3">
                    {mockCompany.contact.social.linkedin && (
                      <a
                        href={mockCompany.contact.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#AD0000]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                    {mockCompany.contact.social.twitter && (
                      <a
                        href={mockCompany.contact.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#AD0000]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Documents</h2>
                <div className="space-y-3">
                  {mockCompany.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{doc.name}</span>
                      </div>
                      <Button
                        className="hover:bg-[#AD0000]"
                        suppressHydrationWarning
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCompany.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCompany.founders.map((founder, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <Users2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">{founder.name}</h3>
                  <p className="text-[#AD0000] mb-2">{founder.role}</p>
                  <p className="text-gray-600">{founder.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Investments</h2>
            <div className="space-y-6">
              {mockCompany.investments.map((investment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{investment.type}</h3>
                      <p className="text-gray-500">{investment.date}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="text-xl font-bold text-[#AD0000]">
                        {investment.amount}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Investors</h4>
                    <div className="flex flex-wrap gap-2">
                      {investment.investors.map((investor, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {investor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Documents</h2>
            <div className="space-y-4">
              {mockCompany.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{doc.type}</p>
                    </div>
                  </div>
                  <Button
                    className="text-[#AD0000] hover:bg-gray-50"
                    suppressHydrationWarning
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 