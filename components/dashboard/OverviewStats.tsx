// components/dashboard/OverviewStats.tsx
'use client';
import { Search, Heart, Mail, Clock } from 'lucide-react';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number; // Percentage change
}

interface OverviewStatsProps {
  className?: string;
}

export function OverviewStats({ className }: OverviewStatsProps) {
  const { data, error, isLoading } = useSWR('/api/v1/dashboard/stats', 
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  if (error) return <div>Failed to load statistics</div>;

  const stats: StatItem[] = [
    {
      title: 'Saved Searches',
      value: data?.savedSearches || 0,
      icon: <Search className="w-6 h-6" />,
      trend: 12
    },
    {
      title: 'Favorite Companies',
      value: data?.favorites || 0,
      icon: <Heart className="w-6 h-6" />,
      trend: -4
    },
    {
      title: 'Active Newsletters',
      value: data?.newsletters || 0,
      icon: <Mail className="w-6 h-6" />,
      trend: 2
    },
    {
      title: 'Recent Activity',
      value: data?.activities || 0,
      icon: <Clock className="w-6 h-6" />
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
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

interface StatCardProps extends StatItem {
  isLoading?: boolean;
}

function StatCard({ title, value, icon, trend, isLoading }: StatCardProps) {
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
        <div className={cn(
          "p-3 rounded-lg",
          isLoading ? 'bg-gray-100' : 'bg-[#AD0000]/10'
        )}>
          {isLoading ? (
            <Skeleton className="w-6 h-6 rounded-full" />
          ) : (
            <div className="text-[#AD0000]">
              {icon}
            </div>
          )}
        </div>
      </div>
      {trend !== undefined && !isLoading && (
        <div className="mt-4 flex items-center space-x-1">
          <span className={cn(
            "text-sm",
            trend > 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {trend > 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
}