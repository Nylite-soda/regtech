import { Filter } from 'lucide-react';

interface Filters {
  location: string;
  size: string;
  service: string;
}

interface CompanyFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export default function CompanyFilters({ filters, setFilters }: CompanyFiltersProps) {
  const locations = ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Ghana'];
  const sizes = ['1-50', '51-200', '201-500', '501-1000', '1000+'];
  const services = ['AML', 'Compliance', 'KYC', 'SupTech', 'Regulatory'];

  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="appearance-none pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000] bg-white"
          suppressHydrationWarning
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <select
        value={filters.size}
        onChange={(e) => setFilters({ ...filters, size: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000] bg-white"
        suppressHydrationWarning
      >
        <option value="">All Sizes</option>
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size} employees
          </option>
        ))}
      </select>

      <select
        value={filters.service}
        onChange={(e) => setFilters({ ...filters, service: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD0000] bg-white"
        suppressHydrationWarning
      >
        <option value="">All Services</option>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
    </div>
  );
} 