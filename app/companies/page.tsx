"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Building2,
  Globe,
  Users,
  Target,
  Briefcase,
  Banknote,
} from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import CompanyFilters from "@/components/CompanyFilters";
import { BASE_URL } from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useToast } from "@/components/ui/toast-context";
import { Button } from "@/components/ui/button";
import { Company } from "@/types";

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export default function CompaniesPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    size: "",
    niche: "",
    yearFounded: "",
  });
  const [initialFilters, setInitialFilters] = useState({
    location: "",
    size: "",
    niche: "",
    yearFounded: "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isInitialRender = useRef(true);

  // Updates URL with current filters and search parameters
  const updateURLWithFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search_term", searchQuery);
    if (filters.location) params.set("country", filters.location);
    if (filters.niche) params.set("niche", filters.niche);
    if (filters.size) params.set("size", filters.size);
    if (filters.yearFounded) params.set("year_founded", filters.yearFounded);
    if (pagination.page > 1) params.set("page", pagination.page.toString());

    // Update URL without reloading the page
    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.pushState({}, "", newURL);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchCompanies(true);
  };

  // Fetch companies based on filters and search
  const fetchCompanies = async (isSearch: boolean = false) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ...(searchQuery && { search_term: searchQuery }),
        ...(filters.location && { country: filters.location }),
        ...(filters.size && { size: filters.size }),
        ...(filters.niche && { niche: filters.niche }),
        ...(filters.yearFounded && { year_founded_min: filters.yearFounded }),
        ...(filters.yearFounded && { year_founded_max: filters.yearFounded }),
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      const url = params.toString()
        ? `${BASE_URL}/public/companies/search?${params}`
        : `${BASE_URL}/api/v1/company/all?page=${pagination.page}&per_page=${pagination.per_page}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const { data, pagination: paginationData } = await response.json();
      setCompanies(data);
      setPagination((prev) => ({
        ...prev,
        total: paginationData.total,
        total_pages: paginationData.total_pages,
      }));

      // Update URL with current filters and search parameters
      updateURLWithFilters();
    } catch (error) {
      showToast("Failed to fetch companies", "error");
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // // Fetch initial companies and handle URL parameters on load
  // useEffect(() => {
  //   const fetchInitialCompanies = async () => {
  //     try {
  //       setIsLoading(true);

  //       // Parse URL parameters
  //       const urlParams = new URLSearchParams(window.location.search);
  //       const countryParam = urlParams.get("country");
  //       const nicheParam = urlParams.get("niche");
  //       const sizeParam = urlParams.get("size");
  //       const yearFoundedParam = urlParams.get("year_founded");
  //       const searchParam = urlParams.get("search_term");
  //       const pageParam = urlParams.get("page");

  //       // Update filters and search state if URL parameters exist
  //       const filtersFromURL = {
  //         location: countryParam || "",
  //         niche: nicheParam || "",
  //         size: sizeParam || "",
  //         yearFounded: yearFoundedParam || "",
  //       };

  //       // Set initial filters for the CompanyFilters component
  //       setInitialFilters(filtersFromURL);

  //       // Update filters state
  //       setFilters(filtersFromURL);

  //       // Update search query if present
  //       if (searchParam) {
  //         setSearchQuery(searchParam);
  //       }

  //       // Update page if present
  //       if (pageParam) {
  //         setPagination((prev) => ({
  //           ...prev,
  //           page: parseInt(pageParam, 10) || 1,
  //         }));
  //       }

  //       // Build query parameters
  //       const params = new URLSearchParams({
  //         ...(countryParam && { country: countryParam }),
  //         ...(nicheParam && { niche: nicheParam }),
  //         ...(sizeParam && { size: sizeParam }),
  //         ...(yearFoundedParam && { year_founded_min: yearFoundedParam }),
  //         ...(yearFoundedParam && { year_founded_max: yearFoundedParam }),
  //         ...(searchParam && { search_term: searchParam }),
  //         page: pageParam || "1",
  //         per_page: pagination.per_page.toString(),
  //       });

  //       // Fetch companies with filters
  //       const hasParams =
  //         countryParam ||
  //         nicheParam ||
  //         sizeParam ||
  //         yearFoundedParam ||
  //         searchParam;
  //       const url = hasParams
  //         ? `${BASE_URL}/public/companies/search?${params}`
  //         : `${BASE_URL}/api/v1/company/all?page=${pagination.page}&per_page=${pagination.per_page}`;

  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //         credentials: "include",
  //       });

  //       if (!response.ok)
  //         throw new Error(`HTTP error! status: ${response.status}`);

  //       const { data, pagination: paginationData } = await response.json();
  //       setCompanies(data);
  //       setPagination(paginationData);
  //     } catch (error) {
  //       showToast("Failed to load companies", "error");
  //       console.error("Error loading companies:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchInitialCompanies();
  // }, []);

  useEffect(() => {
    // Skip the initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const fetchData = setTimeout(() => {
      fetchCompanies(searchQuery !== "");
    }, 500);

    return () => clearTimeout(fetchData);
  }, [searchQuery, filters, pagination.page]);

  useEffect(() => {
    // Only reset if we're not on the first page
    if (pagination.page !== 1) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  }, [filters, searchQuery]);

  // Fetch companies when page changes
  useEffect(() => {
    if (pagination.page > 1) {
      fetchCompanies(searchQuery !== "");
    }
  }, [pagination.page]);

  // Debounced fetch when filters or search change
  useEffect(() => {
    const getData = setTimeout(() => {
      if (!isLoading) {
        // Prevent duplicate fetches during initial load
        fetchCompanies(true);
      }
    }, 500); // Reduced from 1500ms to 500ms for better responsiveness

    return () => clearTimeout(getData);
  }, [searchQuery, filters]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Hero Section */}
      <div className="bg-[#AD0000] text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between px-4 md:px-10 items-start md:items-center gap-4 md:gap-0">
            <div>
              <h1 className="text-3xl md:text-3xl font-bold mb-2 md:mb-4">
                Explore Companies
              </h1>
              <p className="text-base md:text-xl opacity-90">
                Discover and connect with leading RegTech companies across
                Africa
              </p>
            </div>
            <Link
              href="/auth/company/register"
              className="w-full md:w-auto bg-white text-[#AD0000] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              List a Company
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 py-6 md:py-8">
        {/* Search and Filters */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  suppressHydrationWarning
                />
                <Button
                  type="submit"
                  className="absolute h-full right-0 top-1/2 -translate-y-1/2 hover:cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>
            <CompanyFilters
              filters={filters}
              setFilters={setFilters}
              initialFilters={initialFilters}
            />
          </div>
        </div>

        {/* Loading and Error States */}
        {/* {isLoading && (
          <div className="text-center py-12 col-span-full">
            <LoadingScreen />
            <p className="text-xl text-gray-600">Loading companies...</p>
          </div>
        )} */}

        {error && (
          <div className="text-center py-12 col-span-full">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        )}

        {/* Companies Grid */}
        {
          // (isLoading && (
          //   <div className="text-center py-12 col-span-full">
          //     <LoadingScreen />
          //     <p className="text-xl text-gray-600">Loading companies...</p>
          //   </div>
          // )) ||
          !isLoading && !error && (
            <>
              <div className="grid gap-4 md:gap-6" suppressHydrationWarning>
                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr_80px] items-center px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="text-left font-medium text-sm text-gray-700">
                    Company
                  </div>
                  <div className="text-center font-medium text-sm text-gray-700">
                    Niche
                  </div>
                  <div className="text-center font-medium text-sm text-gray-700">
                    Services
                  </div>
                  <div className="text-center font-medium text-sm text-gray-700">
                    Size (employees)
                  </div>
                  <div className="text-center font-medium text-sm text-gray-700">
                    Website
                  </div>
                  <div></div>
                </div>

                {companies.length === 0 && !isLoading ? (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-xl text-gray-600">No Companies Found</p>
                  </div>
                ) : (
                  companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}
