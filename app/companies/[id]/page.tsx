"use client";

import { useState, use, useEffect } from "react";
import {
  Building2,
  Globe,
  Users,
  Target,
  Briefcase,
  Banknote,
  Mail,
  Phone,
  FileText,
  Star,
  Download,
  Share2,
  Users2,
  Lightbulb,
  Newspaper,
  Building,
  Search,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BASE_URL,
  getItem,
  isUserSignedIn,
  logout,
  storeRedirectUrl,
} from "@/lib/utils";
import { BackButton } from "@/components/ui/back-button";
import { useRouter } from "next/navigation";
import Twitter from "@/components/ui/Twitter";
import MarkdownIt from "markdown-it";
import { useToast } from "@/components/ui/toast-context";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface CompanyProfile {
  id: number;
  name: string;
  website: string;
  services: Array<{
    name: string;
    description: string;
  }>;
  lastFundingDate: string;
  acquisitions: number;
  employees: number;
  niche: string;
  type: string;
  location: string;
  logo?: string;
  foundedYear: number;
  description: string;
  ratings?: {
    average: number;
    count: number;
  };
  documents: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  contact: {
    email: string;
    phone: string;
    social: {
      linkedin?: string;
      twitter?: string;
    };
  };
  founders: Array<{
    name: string;
    role: string;
    bio: string;
    avatar?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
  }>;
  investments: Array<{
    date: string;
    amount: string;
    type: string;
    investors: string[];
  }>;
}

const md = new MarkdownIt({
  breaks: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return "";
  },
});

export default function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isUserSignedIn()) {
        setIsRedirecting(true);
        storeRedirectUrl();
        showToast("Please sign in to continue", "info");
        router.push("/auth/signin");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/api/v1/company/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          const res = await response.json();
          if (res.detail && res.detail === "Could not validate credentials!") {
            showToast("Token has expired! Please sign in!", "info");
            logout();
            storeRedirectUrl();
            setCompany(null);
            router.push("/auth/signin");
            return;
          }
          throw new Error(`Failed to fetch company data: ${response.status}`);
        }

        const data = (await response.json()).data;
        setCompany({
          id: data.id,
          name: data.name || data.company_name,
          website: data.website || data.company_website,
          services: data.services,
          lastFundingDate: data.last_funding_date,
          acquisitions: data.acquisitions ?? 0,
          employees: data.company_size,
          niche: data.niche,
          type: data.company_type,
          location: data.headquarters,
          logo: data.logo,
          foundedYear: data.year_founded,
          description: data.description,
          contact: {
            email: data.email || data.company_email,
            phone: data.phone || data.company_phone,
            social: {
              linkedin: data.social_media_linkedIn,
              twitter: data.social_media_X,
            },
          },
          founders: data.founders,
          documents: [],
          investments: [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="bg-[#AD0000] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="animate-pulse flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-white/20"></div>
                <div>
                  <div className="h-6 w-40 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse mb-6">
            <div className="h-10 bg-gray-200 rounded-md w-full"></div>
          </div>
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#AD0000] text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  if (!company)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Company Data Found
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#AD0000] text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Hero Section */}
      <div className="bg-[#AD0000] text-white py-6 md:py-12">
        <div className="container mx-auto px-4">
          <BackButton className="text-white" />
          <div className="flex flex-col md:flex-row items-start md:items-center md:gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white/10 flex items-center justify-center">
                {company.logo ? (
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-lg object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 md:w-10 md:h-10 text-white/80" />
                )}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {company.name}
                </h1>
                <p className="text-white/80 text-sm md:text-base">
                  {company.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 ml-auto mt-4 md:mt-0">
              {/* <Button
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 md:gap-2 text-sm"
                suppressHydrationWarning
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white text-[#AD0000] rounded-lg hover:bg-white/90 text-sm"
                suppressHydrationWarning
              >
                Compare
              </Button> */}
              <Link href="/search">
                <Button
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 md:gap-2 text-sm"
                  suppressHydrationWarning
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Search Companies</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-4 md:mb-8">
          {/* Mobile view - compact grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:hidden mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`tabButton ${
                activeTab === "overview"
                  ? "bg-[#AD0000] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-selected={activeTab === "overview"}
              role="tab"
              suppressHydrationWarning
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`tabButton ${
                activeTab === "services"
                  ? "bg-[#AD0000] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-selected={activeTab === "services"}
              role="tab"
              suppressHydrationWarning
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`tabButton ${
                activeTab === "team"
                  ? "bg-[#AD0000] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-selected={activeTab === "team"}
              role="tab"
              suppressHydrationWarning
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab("investments")}
              className={`tabButton ${
                activeTab === "investments"
                  ? "bg-[#AD0000] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-selected={activeTab === "investments"}
              role="tab"
              suppressHydrationWarning
            >
              Investments
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`tabButton ${
                activeTab === "documents"
                  ? "bg-[#AD0000] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-selected={activeTab === "documents"}
              role="tab"
              suppressHydrationWarning
            >
              Documents
            </button>
          </div>

          {/* Tablet/Desktop view - traditional tabs */}
          <div className="hidden md:block border-b border-gray-200">
            <div className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-4 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-[#AD0000] text-[#AD0000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`pb-4 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "services"
                    ? "border-[#AD0000] text-[#AD0000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`pb-4 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "team"
                    ? "border-[#AD0000] text-[#AD0000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Team
              </button>
              <button
                onClick={() => setActiveTab("investments")}
                className={`pb-4 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "investments"
                    ? "border-[#AD0000] text-[#AD0000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Investments
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`pb-4 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "documents"
                    ? "border-[#AD0000] text-[#AD0000]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                suppressHydrationWarning
              >
                Documents
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="tabContent">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <MarkdownRenderer
                  content={company.description || "No Description Yet"}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Founded</p>
                      <p className="font-medium">{company.foundedYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Employees</p>
                      <p className="font-medium">{company.employees}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Niche</p>
                      <p className="font-medium">{company.niche}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Funding</p>
                      <p className="font-medium">
                        {company.lastFundingDate || "No details yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings and Reviews */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
                  {/* <Button
                    className="hover:text-[#AD0000] hover:border-[#AD0000] border hover:bg-gray-50"
                    suppressHydrationWarning
                  >
                    Write a Review
                  </Button> */}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold ml-1">
                      {company.ratings?.average || "N/A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      {company.ratings?.count || 0} reviews
                    </p>
                  </div>
                </div>

                {/* Review Placeholder */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet.
                    {/* Be the first to review this company. */}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                <div className="space-y-4">
                  {company.contact.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a
                        href={`mailto:${company.contact.email}`}
                        className="text-[#AD0000] hover:underline"
                      >
                        {company.contact.email}
                      </a>
                    </div>
                  )}
                  {company.contact.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a
                        href={`tel:${company.contact.phone}`}
                        className="text-gray-600 hover:text-[#AD0000]"
                      >
                        {company.contact.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#AD0000] hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Social
                  </h3>
                  <div className="flex gap-3">
                    {company.contact.social.linkedin && (
                      <a
                        href={company.contact.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#AD0000]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                    {company.contact.social.twitter && (
                      <a
                        href={company.contact.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#AD0000]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </a>
                    )}
                    {!company.contact.social.linkedin &&
                      !company.contact.social.twitter && (
                        <p className="text-gray-500">
                          No social links available
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                <h2 className="text-xl font-semibold mb-4">Documents</h2>
                <div className="space-y-3">
                  {company.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{doc.name}</span>
                      </div>
                      <Button
                        className="hover:bg-[#AD0000]"
                        suppressHydrationWarning
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {company.documents.length === 0 && (
                    <p className="text-gray-500">No documents available yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-xl font-semibold mb-6">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.services ? (
                company.services.map((service, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-medium mb-2">{service.name}</h3>
                    <MarkdownRenderer content={service.description || ""} />
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No services available yet.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Check back later for updates.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="bg-white rounded-lg mb-6 overflow-hidden">
            <div className="relative">
              {/* Subtle top design element */}
              {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#AD0000]/10 via-[#AD0000] to-[#AD0000]/10"></div> */}

              {/* Header area with refined styling */}
              <div className="px-6 md:px-10 pt-10 pb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px w-8 bg-[#AD0000]"></div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[#AD0000]">
                    Leadership
                  </h3>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white tracking-tight">
                  Our Team
                </h2>
                <p className="mt-3 text-gray-500 max-w-2xl">
                  The talented individuals who drive our vision forward and
                  shape our company's future.
                </p>
              </div>

              {/* Team members grid with refined cards */}
              <div className="px-6 md:px-10 pb-10">
                {company.founders && company.founders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {company.founders.map((founder, index) => (
                      <div
                        key={index}
                        className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300"
                      >
                        {/* Card with hover animation */}
                        <div className="flex flex-col h-full transform-gpu transition-all duration-300 group-hover:translate-y-0">
                          {/* Image with refined handling */}
                          <div className="relative">
                            <div className="aspect-[3/3.2] overflow-hidden bg-gray-50">
                              {founder.avatar ? (
                                <div className="w-full h-full">
                                  <img
                                    src={founder.avatar}
                                    alt={founder.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.src = "/api/placeholder/300/375";
                                      target.classList.add(
                                        "filter",
                                        "grayscale"
                                      );
                                    }}
                                  />
                                  {/* Subtle overlay effect */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                  <Users2 className="w-12 h-12 text-gray-300" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content area with refined spacing */}
                          <div className="p-6 flex-grow flex flex-col justify-between bg-white border-t border-gray-100">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#AD0000] transition-colors duration-300">
                                {founder.name}
                              </h3>
                              <p className="mt-1 text-sm font-medium text-[#AD0000]">
                                {founder.role || "Team Member"}
                              </p>

                              {founder.bio && (
                                <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                                  {founder.bio}
                                </p>
                              )}
                            </div>

                            {/* Social links with refined styling */}
                            {founder.social && (
                              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                {founder.social.linkedin && (
                                  <a
                                    href={founder.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-full text-gray-400 hover:text-[#AD0000] hover:bg-[#AD0000]/5 transition-all duration-300"
                                    aria-label="LinkedIn profile"
                                  >
                                    <Linkedin size={16} />
                                  </a>
                                )}
                                {founder.social.twitter && (
                                  <a
                                    href={founder.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-full text-gray-400 hover:text-[#AD0000] hover:bg-[#AD0000]/5 transition-all duration-300"
                                    aria-label="Twitter profile"
                                  >
                                    <Twitter className="h-4 w-4" />
                                  </a>
                                )}
                                {founder.social.website && (
                                  <a
                                    href={founder.social.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-full text-gray-400 hover:text-[#AD0000] hover:bg-[#AD0000]/5 transition-all duration-300"
                                    aria-label="Personal website"
                                  >
                                    <Globe size={16} />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Subtle border effect */}
                        <div className="absolute inset-0 border border-gray-200 group-hover:border-[#AD0000]/30 rounded-lg pointer-events-none transition-colors duration-300"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 rounded-lg bg-gray-50">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Users2 className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No Team Members Yet
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Team information for this company will appear here once it
                      becomes available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "investments" && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-xl font-semibold mb-6">Investments</h2>
            <div className="space-y-6">
              {company.investments && company.investments.length > 0 ? (
                company.investments.map((investment, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {investment.type}
                        </h3>
                        <p className="text-gray-500">{investment.date}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="text-xl font-bold text-[#AD0000]">
                          {investment.amount}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Investors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {investment.investors.map((investor, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {investor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No data available yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-xl font-semibold mb-6">Documents</h2>
            <div className="space-y-4">
              {company.documents && company.documents.length > 0 ? (
                company.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <Button
                      className="text-[#AD0000] hover:bg-gray-50"
                      suppressHydrationWarning
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No documents available yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case "twitter":
      return <Twitter className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "instagram":
      return <Instagram className="h-4 w-4" />;
  }
};
