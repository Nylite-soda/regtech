// components/dashboard/NewsletterSubscriptions.tsx
'use client';
import { BASE_URL } from '@/lib/utils';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { SectionWrapper } from '../SectionWrapper';

interface Newsletter {
  id: string;
  title: string;
  frequency: string;
  description: string;
  subscribed: boolean;
}

export default function NewsletterSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Newsletter[]>([
    // Mock data
  ]);

  const toggleSubscription = async (id: string, subscribed: boolean) => {
    try {
      await fetch(`${BASE_URL}/api/v1/newsletters/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ subscribed })
      });
      
      setSubscriptions(subs => subs.map(sub => 
        sub.id === id ? { ...sub, subscribed } : sub
      ));
    } catch (error) {
      console.error('Subscription update failed:', error);
    }
  };

  return (
    <SectionWrapper icon={<Mail className="w-5 h-5" />} title="Newsletter Subscriptions">
      <div className="space-y-4">
        {subscriptions.map((newsletter) => (
          <div key={newsletter.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{newsletter.title}</h3>
                <p className="text-sm text-gray-500">{newsletter.description}</p>
                <p className="text-sm mt-1">Frequency: {newsletter.frequency}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletter.subscribed}
                  onChange={(e) => toggleSubscription(newsletter.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#AD0000] peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}