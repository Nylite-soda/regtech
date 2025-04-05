'use client';

import { useState } from 'react';
import { 
  Bell, 
  Building2, 
  CreditCard, 
  Settings, 
  Search, 
  Heart, 
  Mail, 
  FileText,
  ChevronRight,
  Clock,
  Users,
  Target,
  Briefcase,
  Banknote,
  Globe,
  Phone,
  Star,
  Download,
  Share2,
  Users2,
  Lightbulb,
  Newspaper
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileForm from '@/components/ProfileForm';
import SubscriptionManager from '@/components/SubscriptionManager';

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

export default function CompanyDashboardPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [companyData, setCompanyData] = useState<CompanyProfile>(mockCompany);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with actual data
  const recentActivity = [
    { id: 1, type: 'profile', description: 'Updated company profile', time: '2 hours ago' },
    { id: 2, type: 'subscription', description: 'Upgraded to Premium plan', time: '1 day ago' },
    { id: 3, type: 'document', description: 'Added new service catalog', time: '2 days ago' },
  ];

  const notifications = [
    { id: 1, type: 'warning', message: 'Your subscription will renew in 7 days', time: '2 days ago' },
    { id: 2, type: 'info', message: 'New profile views this week', time: '3 days ago' },
  ];

  const handleProfileChange = (field: string, value: string) => {
    setCompanyData(prev => {
      const newData = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'contact') {
          newData.contact = { 
            ...newData.contact, 
            [child]: value 
          };
        }
      } else {
        // Handle top-level fields
        if (field === 'name' || field === 'website' || field === 'location' || 
            field === 'niche' || field === 'description') {
          newData[field] = value;
        }
      }
      return newData;
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // Here you would typically make an API call to update the profile
    setIsEditing(false);
    // Show success message
  };

  const handleSaveContact = () => {
    // Here you would typically make an API call to update the contact info
    // Show success message
  };

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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
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
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'profile' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'subscription' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Subscription</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'analytics' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Target className="w-5 h-5" />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <Bell className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg"
                      >
                        <Clock className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#AD0000]/10 rounded-lg">
                        <Search className="w-6 h-6 text-[#AD0000]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Profile Views</p>
                        <p className="text-2xl font-semibold">1,234</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#AD0000]/10 rounded-lg">
                        <Heart className="w-6 h-6 text-[#AD0000]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Saved by Users</p>
                        <p className="text-2xl font-semibold">56</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#AD0000]/10 rounded-lg">
                        <Mail className="w-6 h-6 text-[#AD0000]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact Requests</p>
                        <p className="text-2xl font-semibold">12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Company Profile Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={companyData.website}
                        onChange={(e) => handleProfileChange('website', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={companyData.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Niche
                      </label>
                      <input
                        type="text"
                        value={companyData.niche}
                        onChange={(e) => handleProfileChange('niche', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={companyData.description}
                      onChange={(e) => handleProfileChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                    />
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
                      disabled={!isEditing}
                    >
                      {isEditing ? 'Save Changes' : 'No Changes'}
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={companyData.contact.email}
                        onChange={(e) => handleProfileChange('contact.email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={companyData.contact.phone}
                        onChange={(e) => handleProfileChange('contact.phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={handleSaveContact}
                      className="px-6 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
                    >
                      Update Contact Info
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <SubscriptionManager />
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Analytics Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-2">Profile Views</h3>
                      <p className="text-3xl font-bold">1,234</p>
                      <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-2">Saved by Users</h3>
                      <p className="text-3xl font-bold">56</p>
                      <p className="text-sm text-gray-500 mt-2">+5% from last month</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-2">Contact Requests</h3>
                      <p className="text-3xl font-bold">12</p>
                      <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
                    </div>
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <span>Search</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">45%</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div className="w-[45%] h-full bg-[#AD0000] rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span>Direct</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">30%</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div className="w-[30%] h-full bg-[#AD0000] rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-5 h-5 text-gray-400" />
                        <span>Referral</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">25%</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div className="w-[25%] h-full bg-[#AD0000] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 