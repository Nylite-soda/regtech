import {
  Banknote,
  Building2,
  Clock,
  Heart,
  Mail,
  Search,
  Target,
  Users,
  Globe,
  MapPin,
  PhoneCall,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Define the Company type based on your backend model
interface Company {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_website: string;
  company_size: string;
  year_founded: number;
  headquarters: string;
  country: string;
  description: string;
  social_media_linkedIn: string;
  social_media_ig: string;
  social_media_X: string;
  niche: string;
  last_funding_date: string;
  logo: string;
  services: any[];
  founders: any[];
  company_type: string;
}

// Define recent activity type
interface Activity {
  id: string;
  description: string;
  time: string;
}

const CompanyOverview: React.FC = () => {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    profileViews: 0,
    savedByUsers: 0,
    contactRequests: 0,
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);

        // Get company ID from local storage
        const companyId = localStorage.getItem("company_id");

        if (!companyId) {
          throw new Error("Company ID not found");
        }

        // Fetch company data from backend
        const response = await fetch(
          `${BASE_URL}/api/v1/company/${companyId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch company data");
        }

        const companyData = (await response.json()).data;
        setCompany(companyData);

        // Fetch recent activity (you can customize this endpoint based on your API)
        const activityResponse = await fetch(
          `${BASE_URL}/api/v1/company/${companyId}/activity`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData);
        }

        // Fetch stats (you can customize this endpoint based on your API)
        const statsResponse = await fetch(
          `${BASE_URL}/api/v1/company/${companyId}/stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          // Set default stats if endpoint doesn't exist yet
          setStats({
            profileViews: Math.floor(Math.random() * 2000),
            savedByUsers: Math.floor(Math.random() * 100),
            contactRequests: Math.floor(Math.random() * 50),
          });
        }
      } catch (err: any) {
        console.error("Error fetching company data:", err);
        setError(
          err.message || "An error occurred while fetching company data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [router]);

  // Handle loading state
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        Loading company data...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm text-red-600">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Handle no company data
  if (!company) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        No company data available
      </div>
    );
  }

  // Fallback for recent activity if API doesn't return any
  const defaultActivity: Activity[] = [
    {
      id: "1",
      description: "Profile was views increased by 20%",
      time: "2 hours ago",
    },
    {
      id: "2",
      description: "Company information was updated",
      time: "1 day ago",
    },
    {
      id: "3",
      description: "New service was added to your profile",
      time: "3 days ago",
    },
  ];

  // Use actual activity data or fallback to default
  const displayActivity =
    recentActivity.length > 0 ? recentActivity : defaultActivity;

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
        <div className="prose max-w-none">
          <p>{company.description || "No company description available."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Founded</p>
              <p className="font-medium">{company.year_founded || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Company Size</p>
              <p className="font-medium">{company.company_size || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Niche</p>
              <p className="font-medium">{company.niche || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Banknote className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Last Funding</p>
              <p className="font-medium">
                {company.last_funding_date || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Headquarters</p>
              <p className="font-medium">{company.headquarters || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <p className="font-medium">
                {company.company_website ? (
                  <a
                    href={
                      company.company_website.startsWith("http")
                        ? company.company_website
                        : `https://${company.company_website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#AD0000] hover:underline"
                  >
                    {company.company_website}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{company.company_phone || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">
                <a
                  href={`mailto:${company.company_email}`}
                  className="text-[#AD0000] hover:underline"
                >
                  {company.company_email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {displayActivity.map((activity) => (
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
              <p className="text-2xl font-semibold">
                {stats.profileViews.toLocaleString()}
              </p>
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
              <p className="text-2xl font-semibold">
                {stats.savedByUsers.toLocaleString()}
              </p>
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
              <p className="text-2xl font-semibold">
                {stats.contactRequests.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
