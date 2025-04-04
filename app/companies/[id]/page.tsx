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
  const [subscriptionLevel, setSubscriptionLevel] = useState<'basic' | 'standard' | 'premium'>('basic');

  return (
    <div className="min-h-screen bg-gray-50 pt-30">
      {/* Header */}
      <div className="bg-[#AD0000] text-white">
        <div className="container mx-auto px-4 py-8">
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
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Companies
              </Link>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button className="px-4 py-2 bg-white text-[#AD0000] rounded-lg hover:bg-white/90">
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'overview' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'services' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Services</span>
                </button>
                <button
                  onClick={() => setActiveTab('people')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'people' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Users2 className="w-5 h-5" />
                  <span>People</span>
                </button>
                <button
                  onClick={() => setActiveTab('solutions')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'solutions' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                  <span>Solutions</span>
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'news' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Newspaper className="w-5 h-5" />
                  <span>News</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Company Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
                  <div className="prose max-w-none">
                    <p>{mockCompany.description}</p>
                  </div>
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
                {subscriptionLevel !== 'basic' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Ratings & Reviews</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="w-6 h-6 text-yellow-400" />
                        <span className="text-2xl font-bold ml-2">{mockCompany.ratings.average}</span>
                      </div>
                      <div className="text-gray-600">
                        <p>{mockCompany.ratings.count} reviews</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a href={`mailto:${mockCompany.contact.email}`} className="text-[#AD0000] hover:underline">
                        {mockCompany.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a href={`tel:${mockCompany.contact.phone}`} className="text-[#AD0000] hover:underline">
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
                </div>

                {/* Documents */}
                {subscriptionLevel !== 'basic' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Documents</h2>
                    <div className="space-y-3">
                      {mockCompany.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                        >
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.type}</p>
                          </div>
                          <Download className="w-5 h-5 text-gray-400 ml-auto" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add other tab content here */}
          </div>
        </div>
      </div>
    </div>
  );
} 