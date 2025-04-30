// components/dashboard/DashboardLayout.tsx
"use client";
import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import { Company, UserData } from "@/types";

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: UserData;
  companyData?: Company;
  navItems: {
    id: string;
    label: string;
    icon: ReactNode;
  }[];
}

export default function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
  userData,
  navItems,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-30">
      <Header userData={userData} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
            isAdmin={userData.is_superadmin}
          />
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
