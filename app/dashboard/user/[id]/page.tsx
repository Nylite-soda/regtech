'use client';

import { useState } from 'react';
import { 
  Bell, 
  User, 
  CreditCard, 
  Settings, 
  Search, 
  Heart, 
  Mail, 
  FileText,
  ChevronRight,
  Clock,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileForm from '@/components/ProfileForm';
import SubscriptionManager from '@/components/SubscriptionManager';
import { getItem } from '@/lib/utils'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual data
  const recentActivity = [
    { id: 1, type: 'search', description: 'Searched for "AML solutions"', time: '2 hours ago' },
    { id: 2, type: 'favorite', description: 'Added RegTech Solutions to favorites', time: '1 day ago' },
    { id: 3, type: 'subscription', description: 'Subscription renewal in 7 days', time: '2 days ago' },
  ];

  const notifications = [
    { id: 1, type: 'warning', message: 'Your subscription will renew in 7 days', time: '2 days ago' },
    { id: 2, type: 'info', message: 'New companies added to your saved search', time: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-30">
      {/* Header */}
      <div className="bg-[#AD0000] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/10 rounded-full">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <Link href={`/dashboard/user/${getItem('user')!.id}`} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span>{getItem('user') ? getItem('user')!.first_name : ""}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
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
                  <User className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'profile' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
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
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'settings' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'saved' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Search className="w-5 h-5" />
                  <span>Saved Searches</span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'favorites' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => setActiveTab('newsletters')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'newsletters' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span>Newsletters</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === 'billing' ? 'bg-[#AD0000]/10 text-[#AD0000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Billing History</span>
                </button>
                {/* <Link
                  href="/checkout"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Subscription</span>
                </Link> */}
                <Link
                  href="/search"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Companies</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <Bell className="w-5 h-5 mt-1" />
                        <div>
                          <p className="text-gray-900">{notification.message}</p>
                          <p className="text-sm text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-4 hover:bg-gray-50 rounded-lg"
                      >
                        <Clock className="w-5 h-5 mt-1 text-gray-400" />
                        <div>
                          <p className="text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
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
                        <p className="text-sm text-gray-500">Saved Searches</p>
                        <p className="text-2xl font-semibold">12</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#AD0000]/10 rounded-lg">
                        <Heart className="w-6 h-6 text-[#AD0000]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Favorite Companies</p>
                        <p className="text-2xl font-semibold">8</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#AD0000]/10 rounded-lg">
                        <Mail className="w-6 h-6 text-[#AD0000]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Active Newsletters</p>
                        <p className="text-2xl font-semibold">3</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <ProfileForm />
            )}

            {activeTab === 'subscription' && (
              <SubscriptionManager />
            )}

            {/* Add other tab content here */}
          </div>
        </div>
      </div>
    </div>
  );
} 