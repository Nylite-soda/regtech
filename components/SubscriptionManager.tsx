'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Info
} from 'lucide-react';

interface Plan {
  name: 'Basic' | 'Standard' | 'Premium';
  price: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  features: string[];
  description: string;
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: {
      monthly: 29,
      quarterly: 79,
      annual: 299,
    },
    features: [
      'Access to basic company profiles',
      'Limited search results',
      'Basic filters',
      'Email support',
      'Monthly newsletter',
    ],
    description: 'Perfect for individuals and small teams',
  },
  {
    name: 'Standard',
    price: {
      monthly: 49,
      quarterly: 139,
      annual: 499,
    },
    features: [
      'All Basic features',
      'Full company profiles',
      'Advanced search and filters',
      'Priority email support',
      'Weekly newsletter',
      'Saved searches',
      'Company favorites',
    ],
    description: 'Ideal for growing businesses',
  },
  {
    name: 'Premium',
    price: {
      monthly: 99,
      quarterly: 279,
      annual: 999,
    },
    features: [
      'All Standard features',
      'API access',
      'Custom reports',
      'Dedicated support',
      'Daily newsletter',
      'Market insights',
      'Competitor analysis',
    ],
    description: 'For enterprise-level needs',
  },
];

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  plan: string;
  period: string;
  invoiceUrl: string;
}

export default function SubscriptionManager() {
  const [currentPlan, setCurrentPlan] = useState<Plan['name']>('Standard');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan['name'] | null>(null);

  // Mock billing history - replace with actual data
  const billingHistory: BillingHistory[] = [
    {
      id: '1',
      date: '2024-03-15',
      amount: 49,
      status: 'success',
      plan: 'Standard',
      period: 'Monthly',
      invoiceUrl: '#',
    },
    {
      id: '2',
      date: '2024-02-15',
      amount: 49,
      status: 'success',
      plan: 'Standard',
      period: 'Monthly',
      invoiceUrl: '#',
    },
  ];

  const handlePlanChange = (plan: Plan['name']) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPlanChange = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#AD0000]/10 rounded-lg">
            <CreditCard className="w-6 h-6 text-[#AD0000]" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{currentPlan} Plan</h3>
            <p className="text-gray-600">
              {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)} billing
            </p>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 ${
                plan.name === currentPlan
                  ? 'border-[#AD0000] bg-[#AD0000]/5'
                  : 'border-gray-200 hover:border-[#AD0000]/50'
              }`}
            >
              <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-2xl font-bold">${plan.price[billingCycle]}</span>
                <span className="text-gray-600">/{billingCycle}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanChange(plan.name)}
                className={`w-full py-2 rounded-lg ${
                  plan.name === currentPlan
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-[#AD0000] text-white hover:bg-[#AD0000]/90'
                }`}
              >
                {plan.name === currentPlan ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        <div className="space-y-4">
          {billingHistory.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{bill.plan} Plan</p>
                <p className="text-sm text-gray-600">
                  {new Date(bill.date).toLocaleDateString()} - {bill.period}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">${bill.amount}</span>
                <a
                  href={bill.invoiceUrl}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Actions</h2>
        <div className="space-y-4">
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <XCircle className="w-5 h-5" />
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Plan Change Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Plan Change</h3>
            <p className="text-gray-600 mb-6">
              You are about to change your plan from {currentPlan} to {selectedPlan}. This change will
              take effect at the start of your next billing cycle.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlanChange}
                className="flex-1 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h3 className="text-lg font-semibold">Cancel Subscription</h3>
                <p className="text-gray-600">
                  Are you sure you want to cancel your subscription? You will lose access to premium
                  features at the end of your current billing period.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  // Handle subscription cancellation
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 