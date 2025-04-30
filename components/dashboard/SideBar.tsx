// components/dashboard/Sidebar.tsx
'use client';
import Image from 'next/image';
import { NavItem } from './DashboardLayout';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: NavItem[];
  isAdmin: boolean;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab,
  navItems,
  isAdmin 
}: SidebarProps) {
  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <nav className="space-y-2">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                activeTab === item.id 
                  ? 'bg-[#AD0000]/10 text-[#AD0000]' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {typeof item.icon === 'string' ? (
                <Image src={item.icon} alt={item.label} width={24} height={24} className="w-6 h-6 rounded-full" />
              ) : (
                item.icon
              )}
              <span className='text-left'>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}