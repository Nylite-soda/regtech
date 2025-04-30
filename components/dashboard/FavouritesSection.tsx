'use client';
import { Heart, HeartOff, Search, FileText, Filter, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast-context';
import { BASE_URL } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CompanyCard from '@/components/CompanyCard';
import { Skeleton } from '@/components/ui/skeleton';
import useSWR, { mutate } from 'swr';
import { Company } from '@/types';

export function FavoritesSection() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [filterOption, setFilterOption] = useState('all');

  const { data: favorites, error, isLoading } = useSWR<Company[]>(
    `${BASE_URL}/api/v1/favorites`,
    async (url: string | URL | Request) => {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch favorites');
      return res.json();
    }
  );

  const handleRemoveFavorite = async (companyId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/favorites/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to remove favorite');
      
      mutate(`${BASE_URL}/api/v1/favorites`);
      showToast('Removed from favorites', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/favorites/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-favorites.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      showToast('Export started', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  // Filter and sort logic
  const filteredFavorites = favorites?.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         company.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterOption === 'all' || 
                         company.niche.toLowerCase() === filterOption.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const sortedFavorites = filteredFavorites?.sort((a, b) => {
    if (sortOption === 'name') return a.name.localeCompare(b.name);
    if (sortOption === 'recent') return new Date(b.added_at!).getTime() - new Date(a.added_at!).getTime();
    return 0;
  });

  // Get unique niches for filter
  const niches = Array.from(new Set(favorites?.map(company => company.niche.toLowerCase()) || []));

  if (error) return <div>Failed to load favorites</div>;

  return (
    <SectionWrapper 
      icon={<Heart className="w-5 h-5" />} 
      title="Favorite Companies"
      className="pb-8"
    >
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search favorites..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterOption} onValueChange={setFilterOption}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{filterOption === 'all' ? 'All niches' : filterOption}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All niches</SelectItem>
              {niches.map(niche => (
                <SelectItem key={niche} value={niche}>
                  {niche.charAt(0).toUpperCase() + niche.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently added</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExport}>
            <FileText className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Favorites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      ) : sortedFavorites && sortedFavorites.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFavorites.map(company => (
              <div key={company.id} className="relative group">
                <CompanyCard company={company} />
                <button
                  onClick={() => handleRemoveFavorite(company.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove from favorites"
                >
                  <HeartOff className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Pagination or Load More */}
          <div className="mt-8 flex justify-center">
            <Button variant="ghost" className="text-[#AD0000]">
              Load more <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No favorites yet</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'No matches found' : 'Save companies to see them here'}
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push('/search')}>
              <Search className="w-4 h-4 mr-2" />
              Browse companies
            </Button>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}