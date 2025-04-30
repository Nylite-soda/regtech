// types.ts
export interface UserData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_superadmin: boolean;
    subscription: string;
    phone_number?: string;
    created_at: string;
    avatar?: string;
  }
  
  export interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
  }
  
  export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: string;
    status: 'paid' | 'pending' | 'failed';
  }
  
  export interface Newsletter {
    id: string;
    title: string;
    frequency: string;
    description: string;
    subscribed: boolean;
  }

  export interface ActivityItem {
    id: string;
    type: 'search' | 'favorite' | 'subscription' | 'notification';
    description: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }
  
  export interface DashboardStats {
    savedSearches: number;
    favorites: number;
    newsletters: number;
    activities: number;
  }

  export interface Subscription {
    id: string;
    plan_id: string;
    plan_name: string;
    amount: number;
    interval: 'month' | 'year';
    status: 'active' | 'cancelled' | 'expired' | 'pending';
    features: string[];
    next_billing_date?: string;
    payment_history?: {
      id: string;
      date: string;
      amount: number;
      status: string;
      description: string;
    }[];
  }

  export interface CompanyService {
    name: string;
    description: string;
    icon?: string;
  }
  
  export interface CompanyDocument {
    name: string;
    url: string;
    type: string;
    size?: string;
    uploadDate?: string;
  }
  
  export interface CompanyFounder {
    name: string;
    role: string;
    bio: string;
    avatar?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
  }
  
  export interface CompanyInvestment {
    date: string;
    amount: string;
    type: string;
    investors: string[];
    round?: string;
    valuation?: string;
  }
  
  export interface CompanySocial {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  }
  
  export interface CompanyContact {
    email: string;
    phone: string;
    social: CompanySocial;
  }
  
  export interface CompanyRatings {
    average: number;
    count: number;
    breakdown?: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  }
  
  export interface Company {
    id: string;
    name: string;
    website: string;
    services: CompanyService[];
    lastFundingDate: string;
    acquisitions: number;
    employees: string;
    niche: string;
    type: string;
    location: string;
    logo: string;
    foundedYear?: number;
    description?: string;
    ratings?: CompanyRatings;
    documents?: CompanyDocument[];
    contact?: CompanyContact;
    founders?: CompanyFounder[];
    investments?: CompanyInvestment[];
    added_at?: string;
  }
  