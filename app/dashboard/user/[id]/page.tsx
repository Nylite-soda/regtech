"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Overview } from "@/components/dashboard/Overview";
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
import { useToast } from "@/components/ui/toast-context";

export default function DashboardPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<UserData | null>(getItem("user"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserSignedIn()) {
      storeRedirectUrl();
      showToast("Please sign in to continue", "info");
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
    // { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
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
        return <Overview />;
      case "profile":
        return <ProfileSection userData={userData} />;
      case "subscription":
        return <SubscriptionSection />;
      case "settings":
        return <SettingsSection userData={userData} />;
      case "saved":
        return <SavedSearchesSection />;
      case "favorites":
        return <FavoritesSection />;
      // case 'newsletters':
      //   return <NewslettersSection />;
      case "billing":
        return <BillingHistory />;
      default:
        return <Overview />;
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
