// components/dashboard/Overview.tsx
"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Heart,
  Mail,
  Clock,
  Bell,
  Building,
  Activity,
  Building2,
} from "lucide-react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL, cn, logout, storeRedirectUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "../ui/toast-context";
import { useRouter } from "next/navigation";
import { UserData } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface StatItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number; // Percentage change
}

interface ActivityItem {
  id: string;
  type: "search" | "favorite" | "newsletter" | "company";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface CompanyItem {
  id: string;
  logo?: string;
  name: string;
  industry: string;
  lastUpdated: string;
  status: "active" | "pending" | "needs_attention";
}

interface DashboardData {
  stats: {
    savedSearches: number;
    favorites: number;
    newsletters?: number;
    activities?: number;
    companies: number;
  };
  recentActivities?: ActivityItem[];
  notifications: NotificationItem[];
  companies: CompanyItem[];
}

export function Overview({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notificationsRead, setNotificationsRead] = useState<string[]>([]);
  const { showToast } = useToast();
  const router = useRouter();
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData>();
  const [isLoading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        showToast("Authentication required", "error");
        storeRedirectUrl();
        router.push("/auth/signin");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      const result = await response.json();

      if (result.detail === "Could not validate credentials!") {
        showToast("Expired! Kindly sign in", "info");
        logout();
        setData(undefined);
        storeRedirectUrl();
        router.push("/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not fetch dashboard data");
      }

      if (result.status === "success") {
        setData(result.data);
        setNotificationsRead(
          result.data.notifications
            .filter((n: NotificationItem) => n.read)
            .map((n: NotificationItem) => n.id)
        );
        const user = {
          first_name: result.data.user.first_name,
          last_name: result.data.user.last_name,
          email: result.data.user.email,
          phone_number: result.data.user.phone_number,
          avatar: result.data.user.avatar,
          role: result.data.user.role,
          status: result.data.user.status,
          subscription: result.data.user.subscription,
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again later.";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearTimeout(handler);
  });

  if (error)
    return (
      <div className="w-full h-full flex items-center justify-center p-4 text-red-500">
        Failed to load dashboard data
      </div>
    );

  const markNotificationAsRead = async (id: string) => {
    if (!notificationsRead.includes(id)) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/notifications/${id}/read`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        if (result.status === "marked_as_read") {
          showToast("Notification marked as read!", "success");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again later.";
        setError(errorMessage);
        showToast(errorMessage, "error");
        console.error(err);
      }

      setNotificationsRead([...notificationsRead, id]);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        {/* Mobile view - compact grid layout */}
        <TabsList className="grid grid-cols-2 gap-2 w-full md:hidden mb-6 bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className={`tabButton h-10 data-[state=active]:bg-[#AD0000] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-none`}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className={`tabButton h-10 data-[state=active]:bg-[#AD0000] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-none`}
          >
            My Companies
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className={`tabButton h-10 data-[state=active]:bg-[#AD0000] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-none`}
          >
            Recent Activity
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className={`tabButton h-10 data-[state=active]:bg-[#AD0000] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-none`}
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Tablet/Desktop view - traditional tabs */}
        <TabsList className="hidden md:flex w-full border-b border-gray-200 bg-transparent p-0 h-auto rounded-none flex-wrap">
          <TabsTrigger
            value="overview"
            className={`pb-4 px-4 border-b-2 rounded-none font-medium text-sm h-auto data-[state=active]:border-[#AD0000] data-[state=active]:text-[#AD0000] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300`}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className={`pb-4 px-4 border-b-2 rounded-none font-medium text-sm h-auto data-[state=active]:border-[#AD0000] data-[state=active]:text-[#AD0000] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300`}
          >
            My Companies
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className={`pb-4 px-4 border-b-2 rounded-none font-medium text-sm h-auto data-[state=active]:border-[#AD0000] data-[state=active]:text-[#AD0000] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300`}
          >
            Recent Activity
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className={`pb-4 px-4 border-b-2 rounded-none font-medium text-sm h-auto data-[state=active]:border-[#AD0000] data-[state=active]:text-[#AD0000] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300`}
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewStats data={data} isLoading={isLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivityPreview
              activities={data?.recentActivities?.slice(0, 5) || []}
              isLoading={isLoading}
            />
            <NotificationsPreview
              notifications={data?.notifications?.slice(0, 5) || []}
              isLoading={isLoading}
              onRead={markNotificationAsRead}
              readIds={notificationsRead}
            />
          </div>
        </TabsContent>

        <TabsContent value="companies">
          <CompanyList
            companies={data?.companies || []}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="activity">
          <RecentActivity
            activities={data?.recentActivities || []}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <Notifications
            notifications={data?.notifications || []}
            isLoading={isLoading}
            onRead={markNotificationAsRead}
            readIds={notificationsRead}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewStats({
  data,
  isLoading,
}: {
  data?: DashboardData;
  isLoading: boolean;
}) {
  const stats: StatItem[] = [
    {
      title: "Saved Searches",
      value: data?.stats?.savedSearches || 0,
      icon: <Search className="w-6 h-6" />,
      trend: 12,
    },
    {
      title: "Favorite Companies",
      value: data?.stats?.favorites || 0,
      icon: <Heart className="w-6 h-6" />,
      trend: -4,
    },
    {
      title: "Active Newsletters",
      value: data?.stats?.newsletters || 0,
      icon: <Mail className="w-6 h-6" />,
      trend: 2,
    },
    {
      title: "My Companies",
      value: data?.stats?.companies || 0,
      icon: <Building className="w-6 h-6" />,
      trend: 8,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  isLoading,
}: StatItem & { isLoading?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-16" />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg",
            isLoading ? "bg-gray-100" : "bg-[#AD0000]/10"
          )}
        >
          {isLoading ? (
            <Skeleton className="w-6 h-6 rounded-full" />
          ) : (
            <div className="text-[#AD0000]">{icon}</div>
          )}
        </div>
      </div>
      {trend !== undefined && !isLoading && (
        <div className="mt-4 flex items-center space-x-1">
          <span
            className={cn(
              "text-sm",
              trend > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {trend > 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
}

function RecentActivityPreview({
  activities,
  isLoading,
}: {
  activities: ActivityItem[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Button variant="ghost" size="sm" className="text-[#AD0000]">
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Activity className="mx-auto h-8 w-8 mb-2" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsPreview({
  notifications,
  isLoading,
  onRead,
  readIds,
}: {
  notifications: NotificationItem[];
  isLoading: boolean;
  onRead: (id: string) => void;
  readIds: string[];
}) {
  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id)
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && !isLoading && (
            <span className="bg-[#AD0000] text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-[#AD0000]">
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="mx-auto h-8 w-8 mb-2" />
          <p>No new notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isRead={readIds.includes(notification.id)}
              onRead={() => onRead(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CompanyList({
  companies,
  isLoading,
}: {
  companies: CompanyItem[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">My Companies</h2>
        <Link href="/auth/company/register">
          <Button className="bg-[#AD0000] hover:bg-[#AD0000]/90">
            Add New Company
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Building className="mx-auto h-10 w-10 mb-4" />
          <p className="text-lg">You haven't added any companies yet</p>
          <p className="text-sm mt-2">Start by adding your first company</p>

          <Link href="/auth/company/register">
            <Button className="mt-4 bg-[#AD0000] hover:bg-[#AD0000]/90">
              Add Company
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <CompanyListItem key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecentActivity({
  activities,
  isLoading,
}: {
  activities: ActivityItem[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Button variant="ghost" size="sm" className="text-[#AD0000]">
          Clear All
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Activity className="mx-auto h-10 w-10 mb-4" />
          <p className="text-lg">No activity yet</p>
          <p className="text-sm mt-2">Your activity will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

function Notifications({
  notifications,
  isLoading,
  onRead,
  readIds,
}: {
  notifications: NotificationItem[];
  isLoading: boolean;
  onRead: (id: string) => void;
  readIds: string[];
}) {
  const unreadNotifications = notifications.filter(
    (n) => !readIds.includes(n.id)
  );
  const readNotifications = notifications.filter((n) => readIds.includes(n.id));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadNotifications.length > 0 && !isLoading && (
            <span className="bg-[#AD0000] text-white text-xs px-2 py-1 rounded-full">
              {unreadNotifications.length} unread
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#AD0000]"
          onClick={() => notifications.forEach((n) => onRead(n.id))}
        >
          Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bell className="mx-auto h-10 w-10 mb-4" />
          <p className="text-lg">No notifications yet</p>
          <p className="text-sm mt-2">Your notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Unread</h3>
              <div className="space-y-4">
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isRead={notification.read}
                    onRead={() => onRead(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {readNotifications.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Read</h3>
              <div className="space-y-4">
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isRead={true}
                    onRead={() => onRead(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const getIcon = () => {
    switch (activity.type) {
      case "search":
        return <Search className="h-5 w-5 text-[#AD0000]" />;
      case "favorite":
        return <Heart className="h-5 w-5 text-[#AD0000]" />;
      case "newsletter":
        return <Mail className="h-5 w-5 text-[#AD0000]" />;
      case "company":
        return <Building className="h-5 w-5 text-[#AD0000]" />;
      default:
        return <Activity className="h-5 w-5 text-[#AD0000]" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <h3 className="font-medium">{activity.title}</h3>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  isRead,
  onRead,
}: {
  notification: NotificationItem;
  isRead: boolean;
  onRead: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 rounded-lg transition-colors",
        !isRead ? "bg-[#AD0000]/5" : "hover:bg-gray-50"
      )}
    >
      <div className="mt-0.5">
        <Bell
          className={cn(
            "h-5 w-5",
            !isRead ? "text-[#AD0000]" : "text-gray-400"
          )}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3
            className={cn(
              "font-medium",
              !isRead ? "text-[#AD0000]" : "text-gray-700"
            )}
          >
            {notification.title}
          </h3>
          {!isRead && (
            <button
              onClick={onRead}
              className="text-xs text-[#AD0000] hover:underline"
            >
              Mark as read
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
      </div>
    </div>
  );
}

function CompanyListItem({ company }: { company: CompanyItem }) {
  const getStatusColor = () => {
    switch (company.status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "needs_attention":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="card flex items-center justify-between p-4 hover:shadow-sm transition-shadow">
      <div className="space-y-1">
        <span className="flex gap-3">
          {company.logo ? (
            <div className="rounded-sm flex items-center justify-center dark:!bg-[#fff]">
              <Image
                src={company.logo}
                alt="logo"
                width={30}
                height={30}
                className="rounded-sm"
              />
            </div>
          ) : (
            <Building2 className="w-6 h-6" />
          )}
          <h3 className="font-medium">{company.name}</h3>
        </span>
        <p className="text-sm text-gray-500">{company.industry}</p>
        <p className="text-xs text-gray-400">Updated {company.lastUpdated}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
          {company.status.replace("_", " ")}
        </span>
        <Link
          onClick={() => localStorage.setItem("company_id", company.id)}
          href={`/dashboard/company/${company.id}`}
        >
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
}
