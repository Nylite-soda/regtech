// 'use client';

// import { useState } from 'react';
// import {
//   Bell,
//   Building2,
//   CreditCard,
//   Settings,
//   Search,
//   Heart,
//   Mail,
//   FileText,
//   ChevronRight,
//   Clock,
//   Users,
//   Target,
//   Briefcase,
//   Banknote,
//   Globe,
//   Phone,
//   Star,
//   Download,
//   Share2,
//   Users2,
//   Lightbulb,
//   Newspaper,
//   Check,
//   Trash2
// } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import ProfileForm from '@/components/ProfileForm';
// import SubscriptionManager from '@/components/SubscriptionManager';
// import { Switch } from '@/components/ui/switch';

// interface CompanyProfile {
//   id: number;
//   name: string;
//   website: string;
//   services: Array<{
//     name: string;
//     description: string;
//   }>;
//   lastFundingDate: string;
//   acquisitions: Array<{
//     date: string;
//     company: string;
//     amount: string;
//   }>;
//   employees: number;
//   employeeBreakdown: Array<{
//     department: string;
//     count: number;
//   }>;
//   niche: string;
//   type: string;
//   location: string;
//   logo?: string;
//   foundedYear: number;
//   description: string;
//   ratings: {
//     average: number;
//     count: number;
//   };
//   documents: Array<{
//     name: string;
//     url: string;
//     type: string;
//   }>;
//   contact: {
//     email: string;
//     phone: string;
//     social: {
//       linkedin?: string;
//       twitter?: string;
//       instagram?: string;
//     };
//   };
//   founders: Array<{
//     name: string;
//     role: string;
//     bio: string;
//   }>;
//   investments: Array<{
//     date: string;
//     amount: string;
//     type: string;
//     investors: string[];
//   }>;
//   visibility: 'public' | 'private';
//   compareEnabled: boolean;
//   news: Array<{
//     title: string;
//     date: string;
//     source: string;
//     url: string;
//   }>;
//   similarCompanies: Array<{
//     id: number;
//     name: string;
//     logo?: string;
//     niche: string;
//   }>;
//   subscription: {
//     plan: 'basic' | 'standard' | 'premium';
//     status: 'active' | 'inactive' | 'pending';
//     renewalDate: string;
//     features: string[];
//   };
//   analytics: {
//     profileViews: number;
//     savedByUsers: number;
//     contactRequests: number;
//     clickThroughRate: number;
//     searchRankings: number;
//     trafficSources: Array<{
//       source: string;
//       percentage: number;
//     }>;
//   };
//   sponsoredAds: Array<{
//     id: number;
//     type: 'banner' | 'sponsored_profile' | 'priority_search';
//     status: 'active' | 'inactive' | 'pending';
//     startDate: string;
//     endDate: string;
//     budget: number;
//     performance: {
//       impressions: number;
//       clicks: number;
//       ctr: number;
//     };
//   }>;
//   paymentHistory: Array<{
//     id: number;
//     date: string;
//     amount: number;
//     status: 'completed' | 'pending' | 'failed';
//     invoiceUrl: string;
//   }>;
// }

// // Mock data - replace with actual data fetching
// const mockCompany: CompanyProfile = {
//   id: 1,
//   name: 'RegTech Solutions',
//   website: 'https://regtech.com',
//   services: [
//     {
//       name: 'AML Solutions',
//       description: 'Advanced anti-money laundering solutions with real-time monitoring and reporting.',
//     },
//     {
//       name: 'Compliance Management',
//       description: 'Comprehensive compliance management system for regulatory requirements.',
//     },
//     {
//       name: 'KYC Services',
//       description: 'Know Your Customer verification and onboarding solutions.',
//     },
//   ],
//   lastFundingDate: '2023-12-15',
//   acquisitions: [
//     {
//       date: '2022-06-15',
//       company: 'ComplianceTech Inc',
//       amount: '$5M',
//     },
//     {
//       date: '2021-03-10',
//       company: 'RegAnalytics',
//       amount: '$2.5M',
//     },
//     {
//       date: '2020-11-05',
//       company: 'KYC Solutions',
//       amount: '$1.8M',
//     }
//   ],
//   employees: 150,
//   employeeBreakdown: [
//     { department: 'Engineering', count: 45 },
//     { department: 'Product', count: 20 },
//     { department: 'Sales', count: 35 },
//     { department: 'Customer Success', count: 25 },
//     { department: 'Operations', count: 15 },
//     { department: 'Finance', count: 10 }
//   ],
//   niche: 'AML',
//   type: 'Private',
//   location: 'South Africa',
//   logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
//   foundedYear: 2018,
//   description: 'RegTech Solutions is a leading provider of regulatory technology solutions in Africa, helping financial institutions streamline their compliance processes.',
//   ratings: {
//     average: 4.5,
//     count: 128,
//   },
//   documents: [
//     {
//       name: 'Company Overview',
//       url: '#',
//       type: 'PDF',
//     },
//     {
//       name: 'Service Catalog',
//       url: '#',
//       type: 'PDF',
//     },
//     {
//       name: 'Annual Report 2023',
//       url: '#',
//       type: 'PDF',
//     },
//     {
//       name: 'Compliance Whitepaper',
//       url: '#',
//       type: 'PDF',
//     }
//   ],
//   contact: {
//     email: 'contact@regtech.com',
//     phone: '+27 123 456 789',
//     social: {
//       linkedin: 'https://linkedin.com/company/regtech',
//       twitter: 'https://twitter.com/regtech',
//       instagram: 'https://instagram.com/regtech'
//     },
//   },
//   founders: [
//     {
//       name: 'John Smith',
//       role: 'CEO & Founder',
//       bio: 'Former compliance officer with 15 years of experience in financial services.',
//     },
//     {
//       name: 'Sarah Johnson',
//       role: 'CTO & Co-founder',
//       bio: 'Tech entrepreneur with expertise in regulatory technology and AI.',
//     },
//     {
//       name: 'Michael Brown',
//       role: 'COO & Co-founder',
//       bio: 'Operations specialist with experience in scaling fintech companies.',
//     }
//   ],
//   investments: [
//     {
//       date: '2023-12-15',
//       amount: '$10M',
//       type: 'Series B',
//       investors: ['Venture Capital Fund', 'Strategic Partner'],
//     },
//     {
//       date: '2022-05-10',
//       amount: '$5M',
//       type: 'Series A',
//       investors: ['Angel Investors Group', 'Tech Accelerator'],
//     },
//     {
//       date: '2020-03-20',
//       amount: '$1.5M',
//       type: 'Seed',
//       investors: ['Founder Fund', 'Local Investors'],
//     }
//   ],
//   visibility: 'public',
//   compareEnabled: true,
//   news: [
//     {
//       title: 'RegTech Solutions Raises $10M Series B',
//       date: '2023-12-15',
//       source: 'Venture Capital Times',
//       url: '#',
//     },
//     {
//       title: 'RegTech Solutions Expands to European Market',
//       date: '2023-10-20',
//       source: 'TechCrunch',
//       url: '#',
//     },
//     {
//       title: 'RegTech Solutions Launches New AML Platform',
//       date: '2023-08-05',
//       source: 'Financial Times',
//       url: '#',
//     }
//   ],
//   similarCompanies: [
//     {
//       id: 2,
//       name: 'FinTech Solutions',
//       logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=FS',
//       niche: 'Finance',
//     },
//     {
//       id: 3,
//       name: 'ComplianceTech',
//       logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=CT',
//       niche: 'Compliance',
//     },
//     {
//       id: 4,
//       name: 'RegAnalytics',
//       logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RA',
//       niche: 'Analytics',
//     }
//   ],
//   subscription: {
//     plan: 'premium',
//     status: 'active',
//     renewalDate: '2024-12-15',
//     features: [
//       'Advanced Analytics',
//       'Priority Placement in Search',
//       'Sponsored Listings',
//       'Banner Ads',
//       'Detailed Employee Breakdown',
//       'Custom Reports'
//     ],
//   },
//   analytics: {
//     profileViews: 1234,
//     savedByUsers: 56,
//     contactRequests: 12,
//     clickThroughRate: 0.25,
//     searchRankings: 100,
//     trafficSources: [
//       { source: 'Search', percentage: 45 },
//       { source: 'Direct', percentage: 30 },
//       { source: 'Referral', percentage: 25 },
//     ],
//   },
//   sponsoredAds: [
//     {
//       id: 1,
//       type: 'banner',
//       status: 'active',
//       startDate: '2023-12-01',
//       endDate: '2024-01-31',
//       budget: 1000,
//       performance: {
//         impressions: 10000,
//         clicks: 500,
//         ctr: 0.05,
//       },
//     },
//     {
//       id: 2,
//       type: 'sponsored_profile',
//       status: 'active',
//       startDate: '2023-12-01',
//       endDate: '2024-01-31',
//       budget: 2000,
//       performance: {
//         impressions: 15000,
//         clicks: 750,
//         ctr: 0.05,
//       },
//     }
//   ],
//   paymentHistory: [
//     {
//       id: 1,
//       date: '2023-12-15',
//       amount: 1000,
//       status: 'completed',
//       invoiceUrl: '#',
//     },
//     {
//       id: 2,
//       date: '2023-11-15',
//       amount: 1000,
//       status: 'completed',
//       invoiceUrl: '#',
//     },
//     {
//       id: 3,
//       date: '2023-10-15',
//       amount: 1000,
//       status: 'completed',
//       invoiceUrl: '#',
//     }
//   ],
// };

// // Add proper type for the notification toggle handler
// interface NotificationToggleEvent {
//   target: {
//     checked: boolean;
//   };
// }

// export default function CompanyDashboardPage({ params }: { params: { id: string } }) {
//   const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'subscription' | 'analytics' | 'ads' | 'payments' | 'documents' | 'settings'>('overview');
//   const [companyData, setCompanyData] = useState<CompanyProfile>(mockCompany);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
//   const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showAdModal, setShowAdModal] = useState(false);
//   const [selectedAdType, setSelectedAdType] = useState<'banner' | 'sponsored_profile' | 'priority_search'>('banner');

//   // Mock data - replace with actual data
//   const recentActivity = [
//     { id: 1, type: 'profile', description: 'Updated company profile', time: '2 hours ago' },
//     { id: 2, type: 'subscription', description: 'Upgraded to Premium plan', time: '1 day ago' },
//     { id: 3, type: 'document', description: 'Added new service catalog', time: '2 days ago' },
//     { id: 4, type: 'ad', description: 'Created new banner ad campaign', time: '3 days ago' },
//     { id: 5, type: 'analytics', description: 'Downloaded monthly report', time: '4 days ago' },
//   ];

//   const notifications = [
//     { id: 1, type: 'warning', message: 'Your subscription will renew in 7 days', time: '2 days ago' },
//     { id: 2, type: 'info', message: 'New profile views this week', time: '3 days ago' },
//     { id: 3, type: 'success', message: 'Your banner ad campaign is performing well', time: '4 days ago' },
//     { id: 4, type: 'warning', message: 'Your ad budget is running low', time: '5 days ago' },
//   ];

//   const handleProfileChange = (field: keyof CompanyProfile | 'contact.email' | 'contact.phone' | 'contact.social.linkedin' | 'contact.social.twitter' | 'contact.social.instagram', value: string | boolean | number) => {
//     setCompanyData(prev => {
//       const newData = { ...prev };
//       if (field.includes('.')) {
//         const [parent, child, subChild] = field.split('.');
//         if (parent === 'contact' && !subChild) {
//           newData.contact = {
//             ...newData.contact,
//             [child]: value as string
//           };
//         } else if (parent === 'contact' && child === 'social') {
//           newData.contact.social = {
//             ...newData.contact.social,
//             [subChild]: value as string
//           };
//         }
//       } else {
//         // Handle top-level fields
//         if (field === 'name' || field === 'website' || field === 'location' ||
//             field === 'niche' || field === 'description' || field === 'type') {
//           (newData[field] as string) = value as string;
//         } else if (field === 'foundedYear' || field === 'employees') {
//           (newData[field] as number) = value as number;
//         } else if (field === 'visibility') {
//           newData.visibility = value as 'public' | 'private';
//         } else if (field === 'compareEnabled') {
//           newData.compareEnabled = value as boolean;
//         }
//       }
//       return newData;
//     });
//     setIsEditing(true);
//   };

//   const handleSaveProfile = () => {
//     // Here you would typically make an API call to update the profile
//     setIsEditing(false);
//     // Show success message
//   };

//   const handleSaveContact = () => {
//     // Here you would typically make an API call to update the contact info
//     // Show success message
//   };

//   const handleUpgradeSubscription = () => {
//     setShowSubscriptionModal(true);
//   };

//   const handleCreateAd = (type: 'banner' | 'sponsored_profile' | 'priority_search') => {
//     setSelectedAdType(type);
//     setShowAdModal(true);
//   };

//   const handleDownloadReport = (type: 'analytics' | 'performance' | 'financial') => {
//     // Here you would typically generate and download a report
//     console.log(`Downloading ${type} report for timeframe: ${selectedTimeframe}`);
//   };

//   const handleVisibilityChange = (visibility: 'public' | 'private') => {
//     setCompanyData(prev => ({
//       ...prev,
//       visibility
//     }));
//   };

//   const handleCompareToggle = (enabled: boolean) => {
//     setCompanyData(prev => ({
//       ...prev,
//       compareEnabled: enabled
//     }));
//   };

//   const handleNotificationToggle = (type: string, event: NotificationToggleEvent): void => {
//     console.log(`Toggle ${type} notifications:`, event.target.checked);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-30">
//       {/* Header */}
//       <div className="bg-[#AD0000] text-white">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center">
//                 {mockCompany.logo ? (
//                   <Image
//                     src={mockCompany.logo}
//                     alt={`${mockCompany.name} logo`}
//                     width={80}
//                     height={80}
//                     className="rounded-lg object-contain"
//                   />
//                 ) : (
//                   <Building2 className="w-10 h-10 text-white/80" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold">{mockCompany.name}</h1>
//                 <p className="text-white/80">{mockCompany.location}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4 ml-auto">
//               <Link
//                 href="/search"
//                 className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2"
//               >
//                 <Search className="w-5 h-5" />
//                 Search Companies
//               </Link>
//               <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2">
//                 <Share2 className="w-5 h-5" />
//                 Share
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <nav className="space-y-2">
//                 <button
//                   onClick={() => setActiveTab('overview')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'overview' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <Building2 className="w-5 h-5" />
//                   <span>Overview</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('profile')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'profile' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <Settings className="w-5 h-5" />
//                   <span>Profile</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('subscription')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'subscription' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <CreditCard className="w-5 h-5" />
//                   <span>Subscription</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('analytics')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'analytics' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <Target className="w-5 h-5" />
//                   <span>Analytics</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('ads')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'ads' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <Newspaper className="w-5 h-5" />
//                   <span>Ads & Promotions</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('payments')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'payments' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <Banknote className="w-5 h-5" />
//                   <span>Payments</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('documents')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'documents' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <FileText className="w-5 h-5" />
//                   <span>Documents</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('settings')}
//                   className={`w-full flex items-center gap-3 p-3 rounded-lg ${
//                     activeTab === 'settings' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <Settings className="w-5 h-5" />
//                   <span>Settings</span>
//                 </button>
//               </nav>
//             </div>

//             {/* Notifications */}
//             <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
//               <h2 className="text-lg font-semibold mb-4">Notifications</h2>
//               <div className="space-y-4">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg"
//                   >
//                     <Bell className="w-5 h-5 text-gray-400 mt-1" />
//                     <div>
//                       <p className="text-sm">{notification.message}</p>
//                       <p className="text-xs text-gray-500">{notification.time}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className="lg:col-span-3">
//             {activeTab === 'overview' && (
//
//             )}

//             {activeTab === 'profile' && (
//
//             )}

//             {activeTab === 'subscription' && (
//               <SubscriptionManager />
//             )}

//             {activeTab === 'analytics' && (
//               <div className="space-y-6">
//                 {/* Analytics Overview */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-lg font-medium">Performance Metrics</h3>
//                     <div className="flex items-center gap-2">
//                       <select
//                         value={selectedTimeframe}
//                         onChange={(e) => setSelectedTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly')}
//                         className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
//                       >
//                         <option value="daily">Daily</option>
//                         <option value="weekly">Weekly</option>
//                         <option value="monthly">Monthly</option>
//                       </select>
//                       <button
//                         onClick={() => handleDownloadReport('analytics')}
//                         className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1"
//                       >
//                         <Download className="w-4 h-4" />
//                         Export
//                       </button>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="bg-gray-50 rounded-lg p-6">
//                       <h3 className="text-lg font-medium mb-2">Profile Views</h3>
//                       <p className="text-3xl font-bold">{companyData.analytics.profileViews}</p>
//                       <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-6">
//                       <h3 className="text-lg font-medium mb-2">Saved by Users</h3>
//                       <p className="text-3xl font-bold">{companyData.analytics.savedByUsers}</p>
//                       <p className="text-sm text-gray-500 mt-2">+5% from last month</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-6">
//                       <h3 className="text-lg font-medium mb-2">Contact Requests</h3>
//                       <p className="text-3xl font-bold">{companyData.analytics.contactRequests}</p>
//                       <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Traffic Sources */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
//                   <div className="space-y-4">
//                     {companyData.analytics.trafficSources.map((source, index) => (
//                       <div key={index} className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           {source.source === 'Search' && <Search className="w-5 h-5 text-gray-400" />}
//                           {source.source === 'Direct' && <Globe className="w-5 h-5 text-gray-400" />}
//                           {source.source === 'Referral' && <Share2 className="w-5 h-5 text-gray-400" />}
//                           <span>{source.source}</span>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="text-gray-500">{source.percentage}%</span>
//                           <div className="w-32 h-2 bg-gray-200 rounded-full">
//                             <div className={`w-[${source.percentage}%] h-full bg-[#AD0000] rounded-full`} style={{ width: `${source.percentage}%` }} />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Search Rankings */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold mb-4">Search Rankings</h2>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <Target className="w-5 h-5 text-gray-400" />
//                         <span>Overall Ranking</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl font-bold">{companyData.analytics.searchRankings}</span>
//                         <span className="text-sm text-green-500">+5</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <Search className="w-5 h-5 text-gray-400" />
//                         <span>Search Visibility</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl font-bold">85%</span>
//                         <span className="text-sm text-green-500">+3%</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'ads' && (
//               <div className="space-y-6">
//                 {/* Ads Overview */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-semibold">Ads & Promotions</h2>
//                     {companyData.subscription.plan === 'premium' ? (
//                       <button
//                         onClick={() => handleCreateAd('banner')}
//                         className="px-4 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
//                       >
//                         Create New Ad
//                       </button>
//                     ) : (
//                       <button
//                         onClick={handleUpgradeSubscription}
//                         className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                       >
//                         Upgrade to Premium
//                       </button>
//                     )}
//                   </div>

//                   {companyData.subscription.plan === 'premium' ? (
//                     <>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                         <div className="bg-gray-50 rounded-lg p-6">
//                           <h3 className="text-lg font-medium mb-2">Active Campaigns</h3>
//                           <p className="text-3xl font-bold">{companyData.sponsoredAds.filter(ad => ad.status === 'active').length}</p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-6">
//                           <h3 className="text-lg font-medium mb-2">Total Impressions</h3>
//                           <p className="text-3xl font-bold">
//                             {companyData.sponsoredAds.reduce((sum, ad) => sum + ad.performance.impressions, 0).toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-6">
//                           <h3 className="text-lg font-medium mb-2">Total Clicks</h3>
//                           <p className="text-3xl font-bold">
//                             {companyData.sponsoredAds.reduce((sum, ad) => sum + ad.performance.clicks, 0).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="space-y-4">
//                         <h3 className="text-lg font-medium">Active Campaigns</h3>
//                         {companyData.sponsoredAds.filter(ad => ad.status === 'active').map((ad) => (
//                           <div key={ad.id} className="border border-gray-200 rounded-lg p-4">
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center gap-2">
//                                 <div className={`px-2 py-1 rounded-full text-xs ${
//                                   ad.status === 'active' ? 'bg-green-100 text-green-800' :
//                                   ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-red-100 text-red-800'
//                                 }`}>
//                                   {ad.status}
//                                 </div>
//                                 <span className="text-sm text-gray-500">
//                                   {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
//                                 </span>
//                               </div>
//                               <button className="text-sm text-blue-600 hover:underline">Edit</button>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//                               <div>
//                                 <p className="text-sm text-gray-500">Impressions</p>
//                                 <p className="font-medium">{ad.performance.impressions.toLocaleString()}</p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-gray-500">Clicks</p>
//                                 <p className="font-medium">{ad.performance.clicks.toLocaleString()}</p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-gray-500">CTR</p>
//                                 <p className="font-medium">{(ad.performance.ctr * 100).toFixed(2)}%</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="text-center py-8">
//                       <h3 className="text-lg font-medium mb-2">Upgrade to Premium for Ad Features</h3>
//                       <p className="text-gray-500 mb-4">Create banner ads, sponsored listings, and get priority placement in search results.</p>
//                       <button
//                         onClick={handleUpgradeSubscription}
//                         className="px-6 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
//                       >
//                         Upgrade Now
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'payments' && (
//               <div className="space-y-6">
//                 {/* Payment History */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold mb-4">Payment History</h2>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="border-b border-gray-200">
//                           <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
//                           <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
//                           <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
//                           <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {companyData.paymentHistory.map((payment) => (
//                           <tr key={payment.id} className="border-b border-gray-100">
//                             <td className="py-3 px-4">{new Date(payment.date).toLocaleDateString()}</td>
//                             <td className="py-3 px-4">${payment.amount.toLocaleString()}</td>
//                             <td className={`py-3 px-4 ${
//                               payment.status === 'completed' ? 'bg-green-100 text-green-800' :
//                               payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                               'bg-red-100 text-red-800'
//                             }`}>
//                               {payment.status}
//                             </td>
//                             <td className="py-3 px-4">
//                               <a href={payment.invoiceUrl} className="text-blue-600 hover:underline text-sm">
//                                 Download
//                               </a>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Current Subscription */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h3 className="text-lg font-medium">{companyData.subscription.plan.charAt(0).toUpperCase() + companyData.subscription.plan.slice(1)} Plan</h3>
//                       <p className="text-sm text-gray-500">Renews on {new Date(companyData.subscription.renewalDate).toLocaleDateString()}</p>
//                     </div>
//                     <div className={`px-2 py-1 rounded-full text-xs ${
//                       companyData.subscription.status === 'active' ? 'bg-green-100 text-green-800' :
//                       companyData.subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {companyData.subscription.status}
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <h4 className="text-sm font-medium mb-2">Included Features:</h4>
//                     <ul className="space-y-1">
//                       {companyData.subscription.features.map((feature, index) => (
//                         <li key={index} className="flex items-center gap-2 text-sm">
//                           <Check className="w-4 h-4 text-green-500" />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="mt-6 flex gap-2">
//                     <button
//                       onClick={handleUpgradeSubscription}
//                       className="px-4 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
//                     >
//                       Upgrade Plan
//                     </button>
//                     <button
//                       onClick={() => setShowPaymentModal(true)}
//                       className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                     >
//                       Update Payment Method
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'documents' && (
//               <div className="space-y-6">
//                 {/* Documents */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-semibold">Company Documents</h2>
//                     <button className="px-4 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90">
//                       Upload Document
//                     </button>
//                   </div>
//                   <div className="space-y-4">
//                     {companyData.documents.map((doc, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <FileText className="w-5 h-5 text-gray-400" />
//                           <div>
//                             <p className="font-medium">{doc.name}</p>
//                             <p className="text-sm text-gray-500">{doc.type}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <a href={doc.url} className="p-2 text-gray-500 hover:text-gray-700">
//                             <Download className="w-5 h-5" />
//                           </a>
//                           <button className="p-2 text-gray-500 hover:text-gray-700">
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'settings' && (
//               <div className="space-y-6">
//                 {/* Profile Visibility */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold mb-4">Profile Visibility</h2>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Profile Visibility</p>
//                         <p className="text-sm text-gray-500">Control who can see your company profile</p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm">{companyData.visibility === 'public' ? 'Public' : 'Private'}</span>
//                         <Switch
//                           checked={companyData.visibility === 'public'}
//                           onCheckedChange={(checked) => handleVisibilityChange(checked ? 'public' : 'private')}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Compare Feature</p>
//                         <p className="text-sm text-gray-500">Allow users to compare your company with others</p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm">{companyData.compareEnabled ? 'Enabled' : 'Disabled'}</span>
//                         <Switch
//                           checked={companyData.compareEnabled}
//                           onCheckedChange={handleCompareToggle}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Notification Settings */}
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Email Notifications</p>
//                         <p className="text-sm text-gray-500">Receive notifications via email</p>
//                       </div>
//                       <Switch defaultChecked />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Profile Views</p>
//                         <p className="text-sm text-gray-500">Get notified when someone views your profile</p>
//                       </div>
//                       <Switch defaultChecked />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Contact Requests</p>
//                         <p className="text-sm text-gray-500">Get notified when someone contacts you</p>
//                       </div>
//                       <Switch defaultChecked />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-medium">Subscription Updates</p>
//                         <p className="text-sm text-gray-500">Get notified about your subscription</p>
//                       </div>
//                       <Switch defaultChecked />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { SubscriptionSection } from "@/components/dashboard/SubscriptionSection";
import SettingsSection from "@/components/dashboard/SettingsSection";
import SavedSearchesSection from "@/components/dashboard/SavedSearches";
import { FavoritesSection } from "@/components/dashboard/FavouritesSection";
// import NewslettersSection from '@/components/dashboard/NewslettersSection';
import BillingHistory from "@/components/dashboard/BillingHistory";
import { getItem, isUserSignedIn, storeRedirectUrl } from "@/lib/utils";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { UserData } from "@/types";
import {
  ChartNoAxesGantt,
  CreditCard,
  FileText,
  Heart,
  Mail,
  Search,
  Settings,
  User,
} from "lucide-react";
import CompanyOverview from "@/components/company/Overview";
import CompanyProfile from "@/components/company/CompanyProfile";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<UserData | null>(getItem("user"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserSignedIn()) {
      storeRedirectUrl();
      router.push("/auth/signin");
      return;
    }
  }, [router]);

  if (!userData || isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingScreen />
      </div>
    );
  }

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <ChartNoAxesGantt className="w-5 h-5" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: userData.avatar || <User className="w-5 h-5" />,
    },
    // {
    //   id: "subscription",
    //   label: "Subscription",
    //   icon: <CreditCard className="w-5 h-5" />,
    // },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
    // { id: 'saved', label: 'Saved Searches', icon: <Search className="w-5 h-5" /> },
    // { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" /> },
    // { id: 'newsletters', label: 'Newsletters', icon: <Mail className="w-5 h-5" /> },
    // { id: 'billing', label: 'Billing History', icon: <FileText className="w-5 h-5" /> },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <CompanyOverview />;
      case "profile":
        return <CompanyProfile />;
      case "subscription":
        return <SubscriptionSection />;
      case "analytics":
        return <SavedSearchesSection />;
      case "ads and promotions":
        return <FavoritesSection />;
      case "billing":
        return <BillingHistory />;
      case "documents":
      // return <NewslettersSection />;
      case "settings":
        return <SettingsSection userData={userData} />;
      default:
        return <CompanyOverview />;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userData={userData}
      navItems={navItems}
    >
      {renderActiveTab()}
    </DashboardLayout>
  );
}
