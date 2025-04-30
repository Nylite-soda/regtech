// components/dashboard/SavedSearches.tsx
'use client';
import { Search, Mail, FileText, ChevronRight } from 'lucide-react';
import { SectionWrapper } from '../SectionWrapper';
import { useState } from 'react';

interface SavedSearch {
  id: string;
  title: string;
  query: string;
  lastUsed: string;
  resultCount: number;
}

export default function SavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([
    // Mock data
  ]);

  return (
    <SectionWrapper icon={<Search className="w-5 h-5" />} title="Saved Searches">
      <div className="space-y-4">
        {searches.map((search) => (
          <div key={search.id} className="border rounded-lg hover:shadow-md transition-shadow">
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{search.title}</h3>
                <p className="text-sm text-gray-500">{search.query}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {search.resultCount} results
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-[#AD0000]">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-500">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}