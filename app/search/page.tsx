'use client';

import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  Briefcase, 
  Calendar, 
  Star, 
  Bookmark,
  SlidersHorizontal,
  X
} from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';

interface SearchFilters {
  location: string[];
  companySize: string[];
  serviceType: string[];
  yearFounded: {
    min: number;
    max: number;
  };
  sortBy: 'relevance' | 'name' | 'founded' | 'employees';
}

export default function AdvancedSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: [],
    companySize: [],
    serviceType: [],
    yearFounded: {
      min: 1900,
      max: new Date().getFullYear(),
    },
    sortBy: 'relevance',
  });
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  // Mock data for filters
  const locations = ['South Africa', 'Kenya', 'Nigeria', 'Egypt', 'Morocco'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const serviceTypes = ['AML', 'KYC', 'Compliance', 'Risk Management', 'Regulatory Reporting'];

  // Mock companies data - replace with actual data fetching
  const companies = [
    {
      id: 1,
      name: 'RegTech Solutions',
      website: 'https://regtech.com',
      services: ['AML', 'KYC', 'Compliance'],
      lastFundingDate: '2023-12-15',
      acquisitions: 3,
      employees: 150,
      niche: 'AML',
      type: 'Private',
      location: 'South Africa',
      logo: 'https://placehold.co/128x128/AD0000/FFFFFF/png?text=RS',
    },
    // Add more mock companies here
  ];

  const handleSaveSearch = () => {
    const searchString = `${searchQuery}${filters.location.length ? ` | Location: ${filters.location.join(', ')}` : ''}`;
    if (!savedSearches.includes(searchString)) {
      setSavedSearches([...savedSearches, searchString]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-30">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
          <p className="text-gray-600 mt-1">Find companies that match your criteria</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Location Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, location: [...filters.location, location] });
                            } else {
                              setFilters({
                                ...filters,
                                location: filters.location.filter((l) => l !== location),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-[#AD0000] focus:ring-[#AD0000]"
                        />
                        <span className="text-sm text-gray-600">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Company Size Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Company Size</h3>
                  <div className="space-y-2">
                    {companySizes.map((size) => (
                      <label key={size} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.companySize.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, companySize: [...filters.companySize, size] });
                            } else {
                              setFilters({
                                ...filters,
                                companySize: filters.companySize.filter((s) => s !== size),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-[#AD0000] focus:ring-[#AD0000]"
                        />
                        <span className="text-sm text-gray-600">{size} employees</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Service Type</h3>
                  <div className="space-y-2">
                    {serviceTypes.map((service) => (
                      <label key={service} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.serviceType.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, serviceType: [...filters.serviceType, service] });
                            } else {
                              setFilters({
                                ...filters,
                                serviceType: filters.serviceType.filter((s) => s !== service),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-[#AD0000] focus:ring-[#AD0000]"
                        />
                        <span className="text-sm text-gray-600">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year Founded Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Year Founded</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min Year</label>
                      <input
                        type="number"
                        value={filters.yearFounded.min}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            yearFounded: { ...filters.yearFounded, min: parseInt(e.target.value) },
                          })
                        }
                        className="w-full rounded-lg border-gray-300 focus:ring-[#AD0000] focus:border-[#AD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Year</label>
                      <input
                        type="number"
                        value={filters.yearFounded.max}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            yearFounded: { ...filters.yearFounded, max: parseInt(e.target.value) },
                          })
                        }
                        className="w-full rounded-lg border-gray-300 focus:ring-[#AD0000] focus:border-[#AD0000]"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value as SearchFilters['sortBy'] })
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
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies by name or keyword..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-[#AD0000] focus:border-[#AD0000]"
                  />
                </div>
                <button
                  onClick={handleSaveSearch}
                  className="px-4 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90 flex items-center gap-2"
                >
                  <Bookmark className="w-5 h-5" />
                  Save Search
                </button>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {filters.location.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    {location}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          location: filters.location.filter((l) => l !== location),
                        })
                      }
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {/* Add similar spans for other active filters */}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6" suppressHydrationWarning>
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 