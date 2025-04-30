// components/dashboard/BillingHistory.tsx
'use client';
import { CreditCard } from 'lucide-react';
import { SectionWrapper } from '../SectionWrapper';
import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

export default function BillingHistory() {
  const [transactions] = useState<Transaction[]>([
    // Mock data
  ]);

  return (
    <SectionWrapper icon={<CreditCard className="w-5 h-5" />} title="Billing History">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-sm font-medium">Description</th>
              <th className="px-4 py-3 text-sm font-medium">Amount</th>
              <th className="px-4 py-3 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm">{tx.date}</td>
                <td className="px-4 py-4 text-sm">{tx.description}</td>
                <td className="px-4 py-4 text-sm">{tx.amount}</td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-0.5 rounded text-xs ${
                    tx.status === 'paid' ? 'bg-green-100 text-green-800' :
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
}