import { Briefcase, MapPin, UsersIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import CountrySelect from "react-select-country-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Define the Country type
interface Country {
  value: string;
  label: string;
}
// Preload country data
const countryData = CountrySelect().getData();

interface Filters {
  location: string;
  size: string;
  niche: string;
  yearFounded: string;
}

interface CompanyFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  initialFilters?: Filters;
}

export default function CompanyFilters({
  filters,
  setFilters,
  initialFilters,
}: CompanyFiltersProps) {
  const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
  const niches = ["AML", "Compliance", "KYC", "SupTech", "Regulatory"];
  const [activeFilters, setActiveFilters] = useState<Filters>({
    location: "",
    size: "",
    niche: "",
    yearFounded: "",
  });
  const [countryOptions, setCountryOptions] = useState<Country[]>(countryData);

  // Initialize country options
  useEffect(() => {
    setCountryOptions(CountrySelect().getData());
  }, []);

  // Set initial filters from URL params if provided
  useEffect(() => {
    if (initialFilters) {
      setActiveFilters(initialFilters);
    }
  }, [initialFilters]);

  // Update parent filters state when local state changes
  useEffect(() => {
    setFilters(activeFilters);
  }, [activeFilters, setFilters]);

  const handleChange = (name: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setActiveFilters({
      location: "",
      size: "",
      niche: "",
      yearFounded: "",
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some((value) => value);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex items-center">
          {/* Country */}
          <Select
            value={activeFilters.location}
            onValueChange={(value) => handleChange("location", value)}
          >
            <SelectTrigger
              className={`appearance-none pl-5 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000] bg-white ${
                activeFilters.location ? "border-red-500" : ""
              }`}
            >
              <MapPin className="w-4 h-4" />
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] max-w-[200px] overflow-y-auto">
              <SelectGroup>
                {countryOptions.map((country) => (
                  <SelectItem key={country.value} value={country.label}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {activeFilters.location && (
            <button
              onClick={() =>
                setActiveFilters({
                  ...activeFilters,
                  location: "",
                })
              }
              className="border border-[#AD0000] ml-3 mr-5 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
              suppressHydrationWarning
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative flex items-center">
          {/* Size */}
          <Select
            value={activeFilters.size}
            onValueChange={(value) => handleChange("size", value)}
          >
            <SelectTrigger
              className={`appearance-none pl-5 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000] bg-white ${
                activeFilters.size ? "border-red-500" : ""
              }`}
            >
              <UsersIcon className="w-4 h-4" />
              <SelectValue placeholder="All Sizes" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] max-w-[200px] overflow-y-auto">
              <SelectGroup>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {activeFilters.size && (
            <button
              onClick={() =>
                setActiveFilters({
                  ...activeFilters,
                  size: "",
                })
              }
              className="border border-[#AD0000] ml-3 mr-5 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
              suppressHydrationWarning
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative flex items-center">
          {/* Niches */}
          <Select
            value={activeFilters.niche}
            onValueChange={(value) => handleChange("niche", value)}
          >
            <SelectTrigger
              className={`appearance-none pl-5 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000] bg-white ${
                activeFilters.niche ? "border-red-500" : ""
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <SelectValue placeholder="All Niches" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] max-w-[200px] overflow-y-auto">
              <SelectGroup>
                {niches.map((niche) => (
                  <SelectItem key={niche} value={niche}>
                    {niche}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {activeFilters.niche && (
            <button
              onClick={() =>
                setActiveFilters({
                  ...activeFilters,
                  niche: "",
                })
              }
              className="border border-[#AD0000] ml-3 mr-5 hover:bg-[#AD0000] hover:text-white p-1 rounded-full"
              suppressHydrationWarning
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clear all filters button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center px-3 py-2 text-sm text-[#AD0000] hover:text-white hover:bg-[#AD0000] border border-[#AD0000] rounded-lg transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
