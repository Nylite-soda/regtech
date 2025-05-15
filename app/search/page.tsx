"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  SlidersHorizontal,
  X,
  UsersIcon,
  CalendarIcon,
} from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { BASE_URL, isUserSignedIn, storeRedirectUrl } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { useToast } from "@/components/ui/toast-context";
import { LoadingScreen } from "@/components/ui/loading-screen";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { CompanyService } from "@/types";
import { useRouter } from "next/navigation";

interface Company {
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
  yearFounded?: number;
}

interface SearchFilters {
  location: string[];
  companySize: string[];
  niche: string[];
  yearFounded?: {
    min?: number;
    max?: number;
  };
  sortBy: "relevance" | "name" | "founded" | "employees";
}

interface PaginationData {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

const DEFAULT_PER_PAGE = 10;
const page = 1;

export default function AdvancedSearchPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: [],
    companySize: [],
    niche: [],
    yearFounded: {},
    sortBy: "relevance",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    total_pages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [minYearDate, setMinYearDate] = useState<dayjs.Dayjs | null>(null);
  const [maxYearDate, setMaxYearDate] = useState<dayjs.Dayjs | null>(null);
  const [minYearPopoverOpen, setMinYearPopoverOpen] = useState(false);
  const [maxYearPopoverOpen, setMaxYearPopoverOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

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

  // Filter options
  const locations = ["South Africa", "Kenya", "Nigeria", "Egypt", "Morocco"];
  const companySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];
  const niches = [
    "AML",
    "KYC",
    "Compliance",
    "Risk Management",
    "Regulatory Reporting",
  ];

  // Fetch all companies on initial load
  useEffect(() => {
    const fetchInitialCompanies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/company/all`, {
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
        setPagination(paginationData);
      } catch (error) {
        showToast("Failed to load companies", "error");
        console.error("Error loading companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialCompanies();
  }, []);

  const fetchCompanies = async (isSearch: boolean = false) => {
    try {
      const params = new URLSearchParams({
        ...(isSearch && searchQuery && { search_term: searchQuery }),
        ...(filters.location.length && { country: filters.location.join(",") }),
        ...(filters.companySize.length && {
          size: filters.companySize.join(","),
        }),
        ...(filters.niche.length && { niche: filters.niche.join(",") }),
        ...(filters.yearFounded?.min && {
          year_founded_min: filters.yearFounded.min.toString(),
        }),
        ...(filters.yearFounded?.max && {
          year_founded_max: filters.yearFounded.max.toString(),
        }),
        sort_by: filters.sortBy,
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      const url =
        isSearch && params
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
      setPagination((prev) => ({
        ...prev,
        total: paginationData.total,
        total_pages: paginationData.total_pages,
      }));
      setCompanies(data);
      // setPagination(paginationData);
    } catch (error) {
      showToast("Failed to fetch companies", "error");
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchCompanies(true);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    if (pagination.page > 1) {
      fetchCompanies(searchQuery !== "");
    }
  }, [pagination.page]);

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchCompanies(true);
    }, 1500);

    return () => clearTimeout(getData);
  }, [searchQuery, filters]);

  const handleSaveSearch = () => {
    const searchString = `${searchQuery}${
      filters.location.length
        ? ` | Location: ${filters.location.join(", ")}`
        : ""
    }`;
    if (!savedSearches.includes(searchString)) {
      setSavedSearches([...savedSearches, searchString]);
      showToast("Search saved successfully", "success");
    }
  };

  const clearFilters = () => {
    setFilters({
      location: [],
      companySize: [],
      niche: [],
      sortBy: "relevance",
      yearFounded: {},
    });
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchCompanies(false);
  };

  useEffect(() => {});

  return (
    <div className="min-h-screen bg-gray-50 pt-30">
      {/* Header */}
      <div className="container px-5 py-6 gap-2 bg-white border-b flex items-center mx-auto">
        <BackButton />
        <div className="md:pl-5">
          <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
          <p className="text-gray-600 mt-1">
            Find companies that match your criteria
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-30 lg:h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between lg:mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <div className="flex gap-2">
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2"
                    variant="ghost"
                    size="icon"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div
                className={`space-y-6 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                {/* Location Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Location
                  </h3>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                location: [...filters.location, location],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                location: filters.location.filter(
                                  (l) => l !== location
                                ),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-[#AD0000] focus:ring-[#AD0000]"
                        />
                        <span className="text-sm text-gray-600">
                          {location}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Company Size Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </h3>
                  <div className="space-y-2">
                    {companySizes.map((size) => (
                      <label key={size} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.companySize.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                companySize: [...filters.companySize, size],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                companySize: filters.companySize.filter(
                                  (s) => s !== size
                                ),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-[#AD0000] focus:ring-[#AD0000]"
                        />
                        <span className="text-sm text-gray-600">
                          {size} employees
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Niche Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Niche
                  </h3>
                  <div className="space-y-2">
                    {niches.map((niche) => (
                      <label key={niche} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.niche.includes(niche)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                niche: [...filters.niche, niche],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                niche: filters.niche.filter((s) => s !== niche),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-[#AD0000] focus:ring-[#AD0000]"
                        />
                        <span className="text-sm text-gray-600">{niche}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year Founded Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Year Founded
                  </h3>
                  <div className="grid gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Min Year
                      </label>
                      <Popover
                        open={minYearPopoverOpen}
                        onOpenChange={setMinYearPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.yearFounded?.min || (
                              <span>Select min year</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                              maxDate={
                                filters.yearFounded?.max
                                  ? dayjs(filters.yearFounded.max.toString())
                                  : dayjs()
                              }
                              value={minYearDate}
                              onChange={(newDate) => {
                                if (newDate) {
                                  setMinYearDate(newDate);
                                  setFilters({
                                    ...filters,
                                    yearFounded: {
                                      ...filters.yearFounded,
                                      min: parseInt(newDate.format("YYYY")),
                                    },
                                  });
                                  setMinYearPopoverOpen(false);
                                }
                              }}
                              views={["year"]}
                              openTo="year"
                              sx={{
                                width: "100%",
                                height: "auto",
                                "& .MuiPickersCalendarHeader-root": {
                                  paddingLeft: "16px",
                                  paddingRight: "16px",
                                  marginTop: "8px",
                                },
                                "& .MuiPickersDay-root.Mui-selected": {
                                  backgroundColor: "#AD0000",
                                },
                                "& .MuiPickersDay-root.Mui-selected:hover": {
                                  backgroundColor: "#890000",
                                },
                                "& .MuiPickersDay-root.Mui-selected:focus": {
                                  backgroundColor: "#AD0000",
                                },
                                "& .MuiYearCalendar-root .MuiPickersYear-yearButton.Mui-selected":
                                  {
                                    backgroundColor: "#AD0000",
                                  },
                                "& .MuiYearCalendar-root .MuiPickersYear-yearButton:not(.Mui-selected):hover":
                                  {
                                    backgroundColor: "rgba(173, 0, 0, 0.1)",
                                  },
                              }}
                            />
                          </LocalizationProvider>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Max Year
                      </label>
                      <Popover
                        open={maxYearPopoverOpen}
                        onOpenChange={setMaxYearPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.yearFounded?.max || (
                              <span>Select max year</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                              minDate={
                                filters.yearFounded?.min
                                  ? dayjs(filters.yearFounded.min.toString())
                                  : undefined
                              }
                              maxDate={dayjs()}
                              value={maxYearDate}
                              onChange={(newDate) => {
                                if (newDate) {
                                  setMaxYearDate(newDate);
                                  setFilters({
                                    ...filters,
                                    yearFounded: {
                                      ...filters.yearFounded,
                                      max: parseInt(newDate.format("YYYY")),
                                    },
                                  });
                                  setMaxYearPopoverOpen(false);
                                }
                              }}
                              views={["year"]}
                              openTo="year"
                              sx={{
                                width: "100%",
                                height: "auto",
                                "& .MuiPickersCalendarHeader-root": {
                                  paddingLeft: "16px",
                                  paddingRight: "16px",
                                  marginTop: "8px",
                                },
                                "& .MuiPickersDay-root.Mui-selected": {
                                  backgroundColor: "#AD0000",
                                },
                                "& .MuiPickersDay-root.Mui-selected:hover": {
                                  backgroundColor: "#890000",
                                },
                                "& .MuiPickersDay-root.Mui-selected:focus": {
                                  backgroundColor: "#AD0000",
                                },
                                "& .MuiYearCalendar-root .MuiPickersYear-yearButton.Mui-selected":
                                  {
                                    backgroundColor: "#AD0000",
                                  },
                                "& .MuiYearCalendar-root .MuiPickersYear-yearButton:not(.Mui-selected):hover":
                                  {
                                    backgroundColor: "rgba(173, 0, 0, 0.1)",
                                  },
                              }}
                            />
                          </LocalizationProvider>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sortBy: e.target.value as SearchFilters["sortBy"],
                      })
                    }
                    className="w-full rounded-lg border-gray-300 focus:ring-[#AD0000] focus:border-[#AD0000]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="name">Company Name</option>
                    <option value="founded">Year Founded</option>
                    <option value="employees">Company Size</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies by name or keyword..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-[#AD0000] focus:border-[#AD0000]"
                  />
                  <Button
                    type="submit"
                    className="absolute h-full right-0 top-1/2 -translate-y-1/2 hover:cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={handleSaveSearch}
                  className="px-4 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90 flex items-center gap-2"
                >
                  <Bookmark className="w-5 h-5" />
                  Save Search
                </Button>
              </form>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {filters.location.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    {location}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          location: filters.location.filter(
                            (l) => l !== location
                          ),
                        })
                      }
                      className="ml-1 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {filters.companySize.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 text-sm"
                  >
                    <UsersIcon className="w-4 h-4" />
                    {size}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          companySize: filters.companySize.filter(
                            (l) => l !== size
                          ),
                        })
                      }
                      className="ml-1 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {filters.niche.map((niche) => (
                  <span
                    key={niche}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 text-sm"
                  >
                    <Briefcase className="w-4 h-4" />
                    {niche}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          niche: filters.niche.filter((l) => l !== niche),
                        })
                      }
                      className="ml-1 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {filters.yearFounded?.min && (
                  <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    Min Year: {filters.yearFounded.min}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          yearFounded: {
                            ...filters.yearFounded,
                            min: undefined,
                          },
                        })
                      }
                      className="ml-1 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.yearFounded?.max && (
                  <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    Max Year: {filters.yearFounded.max}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          yearFounded: {
                            ...filters.yearFounded,
                            max: undefined,
                          },
                        })
                      }
                      className="ml-1 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center">
                <LoadingScreen />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Table Headers - Desktop Only */}
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
                    Size
                  </div>
                  <div className="font-medium text-sm text-gray-700">
                    Website
                  </div>
                  <div></div>
                </div>

                {/* Company Cards */}
                <div className="md:divide-y md:divide-gray-200">
                  {companies.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      {searchQuery ||
                      filters.location.length ||
                      filters.companySize.length ||
                      filters.niche.length
                        ? "No companies found matching your criteria"
                        : "No companies available"}
                    </div>
                  ) : (
                    companies.map((company) => (
                      <CompanyCard
                        key={company.id}
                        company={{
                          ...company,
                          services: company.services,
                          employees: company.employees || "N/A",
                        }}
                      />
                    ))
                  )}
                </div>

                {/* Pagination */}
                {companies.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.total_pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
