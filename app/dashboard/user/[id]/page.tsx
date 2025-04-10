'use client';

import { useEffect, useState } from 'react';
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
  Building2,
  Save,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Monitor,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileForm from '@/components/ProfileForm';
import SubscriptionManager from '@/components/SubscriptionManager';
import { getItem } from '@/lib/utils'
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast-context';
import { LoadingScreen } from '@/components/ui/loading-screen';
import CompanyCard from '@/components/CompanyCard';

interface UserData {
  id: string,
  email: string,
  subscription: string,
  phone_number: number | null,
  password: string,
  confirm_password: string,
  first_name: string,
  last_name: string,
}

const companies = [
  {
    id: 1,
    name: 'RegTech Solutions',
    website: 'https://regtech.com',
    services: ['AML', 'KYC', 'Compliance'],
    lastFundingDate: '2023-12-15',
    acquisitions: 3,
    employees: 150,
    niche: 'AML',
    type: 'Private',
    location: 'South Africa',
    logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
  },
  {
    id: 2,
    name: 'RegTech Solutions',
    website: 'https://regtech.com',
    services: ['AML', 'KYC', 'Compliance'],
    lastFundingDate: '2023-12-15',
    acquisitions: 3,
    employees: 150,
    niche: 'AML',
    type: 'Private',
    location: 'South Africa',
    logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
  },
  {
    id: 3,
    name: 'RegTech Solutions',
    website: 'https://regtech.com',
    services: ['AML', 'KYC', 'Compliance'],
    lastFundingDate: '2023-12-15',
    acquisitions: 3,
    employees: 150,
    niche: 'AML',
    type: 'Private',
    location: 'South Africa',
    logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
  },
  {
    id: 4,
    name: 'RegTech Solutions',
    website: 'https://regtech.com',
    services: ['AML', 'KYC', 'Compliance'],
    lastFundingDate: '2023-12-15',
    acquisitions: 3,
    employees: 150,
    niche: 'AML',
    type: 'Private',
    location: 'South Africa',
    logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
  },
  {
    id: 5,
    name: 'RegTech Solutions',
    website: 'https://regtech.com',
    services: ['AML', 'KYC', 'Compliance'],
    lastFundingDate: '2023-12-15',
    acquisitions: 3,
    employees: 150,
    niche: 'AML',
    type: 'Private',
    location: 'South Africa',
    logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
  },
  {
    id: 6,
    name: 'RegTech Solutions',
    website: 'https://regtech.com',
    services: ['AML', 'KYC', 'Compliance'],
    lastFundingDate: '2023-12-15',
    acquisitions: 3,
    employees: 150,
    niche: 'AML',
    type: 'Private',
    location: 'South Africa',
    logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    email_notifications: true,
    browser_notifications: false,
    two_factor_auth: false,
    dark_mode: false,
    language: 'english',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (!storedData) {
      router.push("/auth/company-login");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/register");
    }
  }, [router]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingScreen />
      </div>
    )
  }

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

  // Settings handlers
  interface SettingsChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> {}

  const handleSettingsChange = (e: SettingsChangeEvent) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSettingsForm({
      ...settingsForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveSettings = (section:any) => {
    showToast(
      `Your ${section} settings have been updated successfully.`,
      'success'
    );
  };

  // const handlePasswordChange = (e) => {
  //   e.preventDefault();
    
  //   if (settingsForm.new_password !== settingsForm.confirm_password) {
  //     showToast(
  //       'New passwords do not match.',
  //       'error'
  //     );
  //   }
    
  //   if (settingsForm.new_password.length < 8) {
  //     showToast({
  //       title: 'Password Error',
  //     showToast(
  //       'Password must be at least 8 characters long.',
  //       'error'
  //     );
    
  //   showToast({
  //     title: 'Password Updated',
  //     description: 'Your password has been changed successfully.',
  //   showToast(
  //     'Your password has been changed successfully.',
  //     'success'
  //   );
  //     current_password: '',
  //     new_password: '',
  //     confirm_password: '',
  //   });
  // };

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
              <Link href={`/dashboard/user/${userData.id}`} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span>{userData.first_name}</span>
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
              <ProfileForm {...userData} />
            )}

            {activeTab === 'subscription' && (
              <SubscriptionManager />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive email updates about your account activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="email_notifications"
                          checked={settingsForm.email_notifications}
                          onChange={handleSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD0000]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Browser Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="browser_notifications"
                          checked={settingsForm.browser_notifications}
                          onChange={handleSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD0000]"></div>
                      </label>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => handleSaveSettings('notification')} 
                        className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Notification Settings
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="two_factor_auth"
                          checked={settingsForm.two_factor_auth}
                          onChange={handleSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD0000]"></div>
                      </label>
                    </div>
                    
                    <form onSubmit={()=> showToast("Successfully updated password", "success")} className="space-y-4 mt-4">
                      <h3 className="font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="current_password"
                            value={settingsForm.current_password}
                            onChange={handleSettingsChange}
                            placeholder="Current Password"
                            className="w-full p-3 border rounded-lg pr-10"
                            required
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        
                        <input
                          type={showPassword ? "text" : "password"}
                          name="new_password"
                          value={settingsForm.new_password}
                          onChange={handleSettingsChange}
                          placeholder="New Password"
                          className="w-full p-3 border rounded-lg"
                          required
                        />
                        
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirm_password"
                          value={settingsForm.confirm_password}
                          onChange={handleSettingsChange}
                          placeholder="Confirm New Password"
                          className="w-full p-3 border rounded-lg"
                          required
                        />
                        
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </button>
                      </div>
                    </form>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => handleSaveSettings('security')} 
                        className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Security Settings
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="dark_mode"
                          checked={settingsForm.dark_mode}
                          onChange={handleSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD0000]"></div>
                      </label>
                    </div>
                    
                    <div className="p-4 hover:bg-gray-50 rounded-lg">
                      <p className="font-medium mb-2">Language</p>
                      <select
                        name="language"
                        value={settingsForm.language}
                        onChange={handleSettingsChange}
                        className="w-full p-3 border rounded-lg bg-white"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                      </select>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => handleSaveSettings('preference')} 
                        className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Session Management
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-500">Chrome on Windows • {userData?.email}</p>
                          <p className="text-sm text-gray-500">IP: 192.168.1.1 • Last active: Just now</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                      </div>
                    </div>
                    
                    <div className="p-4 hover:bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-sm text-gray-500">iPhone 15 • iOS 18.2</p>
                          <p className="text-sm text-gray-500">IP: 172.16.0.1 • Last active: 2 hours ago</p>
                        </div>
                        <button className="text-[#AD0000] text-sm font-medium hover:underline">
                          Revoke
                        </button>
                      </div>
                    </div>
                    
                    <button className="text-[#AD0000] text-sm font-medium hover:underline">
                      Sign out from all devices
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg">
                      <p className="font-medium">Download Your Data</p>
                      <p className="text-sm text-gray-500 mb-2">Get a copy of all your data associated with your account</p>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        Request Data Export
                      </button>
                    </div>
                    
                    <div className="p-4 border border-red-200 rounded-lg">
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-gray-500 mb-2">Once you delete your account, there is no going back</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Saved Searches</h2>
                    <button className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      New Search
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Saved search items */}
                    <div className="border rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-4 flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">AML Solution Providers</h3>
                          <p className="text-sm text-gray-500">Created: Jan 15, 2025</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">RegTech</span>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Compliance</span>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">AML</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                            <Search className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                            <Mail className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-500">
                            <FileText className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 border-t">
                        <p className="text-sm">Last updated: 2 days ago</p>
                        <p className="text-sm mt-1">15 companies found</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-4 flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Crypto Compliance Services</h3>
                          <p className="text-sm text-gray-500">Created: Feb 3, 2025</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Crypto</span>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Blockchain</span>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">KYC</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                            <Search className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                            <Mail className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-500">
                            <FileText className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 border-t">
                        <p className="text-sm">Last updated: 1 week ago</p>
                        <p className="text-sm mt-1">8 companies found</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg hover:shadow-md transition-shadow">
                      <div className="p-4 flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">European KYC Providers</h3>
                          <p className="text-sm text-gray-500">Created: Mar 12, 2025</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">EU</span>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">Identity</span>
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">KYC</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                            <Search className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                            <Mail className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-red-500">
                            <FileText className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 border-t">
                        <p className="text-sm">Last updated: 3 days ago</p>
                        <p className="text-sm mt-1">12 companies found</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button className="text-[#AD0000] font-medium hover:underline flex items-center">
                      <span>Load More</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Favorite Companies</h2>
                    <div className="flex gap-2">
                      <select className="p-2 border rounded-lg bg-white">
                        <option>Sort by: Recently Added</option>
                        <option>Sort by: Alphabetical</option>
                        <option>Sort by: Company Size</option>
                      </select>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Favorite companies */}
                    {companies.map((company) => (
                      <CompanyCard key={company.id} company={company} />
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button className="text-[#AD0000] font-medium hover:underline flex items-center">
                      <span>Load More</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'newsletters' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Newsletter Subscriptions</h2>
                    <button className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Manage Preferences
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">RegTech Weekly Update</h3>
                          <p className="text-sm text-gray-500">Weekly news on regulatory technology updates</p>
                          <p className="text-sm mt-2">Delivered every Monday • Last edition: April 8, 2025</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD0000]"></div>
                        </label>
                      </div>
                      <div className="mt-4 flex gap-2 text-sm">
                        <Link href="/newsletters/regtech/archives" className="text-[#AD0000] hover:underline">
                          View Past Editions
                        </Link>
                        <span className="text-gray-400">•</span>
                        <button className="text-[#AD0000] hover:underline">
                          Customize Topics
                        </button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">AML Compliance Digest</h3>
                          <p className="text-sm text-gray-500">Monthly roundup of AML compliance news and regulations</p>
                          <p className="text-sm mt-2">Delivered on the 1st of each month • Last edition: April 1, 2025</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={true}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD0000]"></div>
                        </label>
                      </div>
                      <div className="mt-4 flex gap-2 text-sm">
                        <Link href="/newsletters/aml/archives" className="text-[#AD0000] hover:underline">
                          View Past Editions
                        </Link>
                        <span className="text-gray-400">•</span>
                        <button className="text-[#AD0000] hover:underline">
                          Customize Topics
                        </button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">KYC Technology Trends</h3>
                          <p className="text-sm text-gray-500">Quarterly insights on KYC technology innovations</p>
                          <p className="text-sm mt-2">Delivered quarterly • Next edition: July 1, 2025</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={true}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AD0000]"></div>
                        </label>
                      </div>
                      <div className="mt-4 flex gap-2 text-sm">
                        <Link href="/newsletters/kyc/archives" className="text-[#AD0000] hover:underline">
                          View Past Editions
                        </Link>
                        <span className="text-gray-400">•</span>
                        <button className="text-[#AD0000] hover:underline">
                          Customize Topics
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-medium text-lg mb-4">Available Newsletters</h3>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">Crypto Compliance Insights</h3>
                            <p className="text-sm text-gray-500">Bi-weekly updates on crypto regulation and compliance</p>
                          </div>
                          <button className="px-3 py-1 border border-[#AD0000] text-[#AD0000] rounded-lg hover:bg-[#AD0000] hover:text-white transition-colors">
                            Subscribe
                          </button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">RegTech Funding Alert</h3>
                            <p className="text-sm text-gray-500">Monthly updates on funding and investment in RegTech</p>
                          </div>
                          <button className="px-3 py-1 border border-[#AD0000] text-[#AD0000] rounded-lg hover:bg-[#AD0000] hover:text-white transition-colors">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Billing History</h2>
                    <div className="flex gap-2">
                      <select className="p-2 border rounded-lg bg-white">
                        <option>Filter by: All Transactions</option>
                        <option>Filter by: Subscriptions</option>
                        <option>Filter by: One-time Purchases</option>
                      </select>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b">
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500">Description</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-500">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm">Apr 01, 2025</td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium">Premium Subscription - Monthly</p>
                              <p className="text-sm text-gray-500">Subscription renewal</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">$99.00</td>
                          <td className="px-4 py-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-[#AD0000] text-sm font-medium hover:underline">
                              Download
                            </button>
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm">Mar 01, 2025</td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium">Premium Subscription - Monthly</p>
                              <p className="text-sm text-gray-500">Subscription renewal</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">$99.00</td>
                          <td className="px-4 py-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-[#AD0000] text-sm font-medium hover:underline">
                              Download
                            </button>
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm">Feb 01, 2025</td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium">Premium Subscription - Monthly</p>
                              <p className="text-sm text-gray-500">Subscription renewal</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">$99.00</td>
                          <td className="px-4 py-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-[#AD0000] text-sm font-medium hover:underline">
                              Download
                            </button>
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm">Jan 15, 2025</td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium">Data Export - Advanced Report</p>
                              <p className="text-sm text-gray-500">One-time purchase</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">$49.00</td>
                          <td className="px-4 py-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-[#AD0000] text-sm font-medium hover:underline">
                              Download
                            </button>
                          </td>
                        </tr>
                        
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm">Jan 01, 2025</td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium">Premium Subscription - Monthly</p>
                              <p className="text-sm text-gray-500">Subscription renewal</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">$99.00</td>
                          <td className="px-4 py-4">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-[#AD0000] text-sm font-medium hover:underline">
                              Download
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-500">
                      Showing 5 of 12 transactions
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Previous
                      </button>
                      <button className="px-3 py-1 bg-[#AD0000] text-white rounded-lg">
                        1
                      </button>
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                        2
                      </button>
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                        3
                      </button>
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-medium text-lg mb-4">Payment Methods</h3>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded">
                              <CreditCard className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-gray-500">Expires 06/27</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">
                              Default
                            </span>
                            <button className="text-gray-500 hover:text-[#AD0000]">
                              <Settings className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button className="flex items-center gap-2 text-[#AD0000] font-medium hover:underline">
                        <CreditCard className="w-4 h-4" />
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add other tab content here */}
          </div>
        </div>
      </div>
    </div>
  );
}

