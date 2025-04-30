// components/dashboard/PreferencesSettings.tsx
'use client';
import { useState } from 'react';
import { Globe, Monitor, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';
import { SectionWrapper } from '../SectionWrapper';
import { BASE_URL } from '@/lib/utils';
import { useToast } from '../ui/toast-context';

export default function PreferencesSettings() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('english');
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      // Example API call
      await fetch(`${BASE_URL}/api/v1/users/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ theme, language })
      });
      
      showToast('Preferences saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save preferences', 'error');
    }
  };

  return (
    <SectionWrapper icon={<Globe className="w-5 h-5" />} title="Preferences">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-gray-500">Switch between light and dark themes</p>
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="p-4 hover:bg-gray-50 rounded-lg">
          <label className="font-medium mb-2 block">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
          </select>
        </div>
        
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center"
        >
          Save Preferences
        </button>
      </div>
    </SectionWrapper>
  );
}