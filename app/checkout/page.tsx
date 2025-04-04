'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Info,
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard as CardIcon,
  MapPin,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import { getItem } from '@/lib/utils';

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

interface CheckoutForm {
  plan: Plan['name'];
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<'plan' | 'review' | 'payment' | 'confirmation'>('plan');
  const [form, setForm] = useState<CheckoutForm>({
    plan: 'Standard',
    billingCycle: 'monthly',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePlanSelect = (plan: Plan['name'], cycle: 'monthly' | 'quarterly' | 'annual') => {
    setForm({ ...form, plan, billingCycle: cycle });
    setStep('review');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    
    // Simulate payment processing
    try {
      // Add your payment processing logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('confirmation');
    } catch (error) {
      setPaymentError('Payment processing failed. Please try again or use a different payment method.');
    }
  };

  const selectedPlan = plans.find(p => p.name === form.plan)!;
  const price = selectedPlan.price[form.billingCycle];

  return (
    <div className="min-h-screen bg-gray-50 pt-30">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/user/${getItem('user')!.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200">
                <div 
                  className="h-full bg-[#AD0000] transition-all duration-300"
                  style={{
                    width: step === 'plan' ? '0%' : step === 'review' ? '50%' : '100%'
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      step === 'plan' || step === 'review' || step === 'payment' || step === 'confirmation'
                        ? 'bg-[#AD0000] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-sm font-medium ${
                    step === 'plan' ? 'text-[#AD0000]' : 'text-gray-600'
                  }`}>
                    Select Plan
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      step === 'review' || step === 'payment' || step === 'confirmation'
                        ? 'bg-[#AD0000] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-sm font-medium ${
                    step === 'review' ? 'text-[#AD0000]' : 'text-gray-600'
                  }`}>
                    Review Order
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      step === 'payment' || step === 'confirmation'
                        ? 'bg-[#AD0000] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    3
                  </div>
                  <span className={`text-sm font-medium ${
                    step === 'payment' ? 'text-[#AD0000]' : 'text-gray-600'
                  }`}>
                    Payment
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Select Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className="flex flex-col justify-between rounded-lg border p-6 hover:border-[#AD0000]/50 cursor-pointer transition-all duration-300"
                      onClick={() => handlePlanSelect(plan.name, 'monthly')}
                    >
                      <div>
                        <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">${plan.price.monthly}</span>
                          <span className="text-gray-600">/month</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="w-full py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90">
                        Select Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Review Order */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{form.plan} Plan</h3>
                      <p className="text-sm text-gray-600">
                        {form.billingCycle.charAt(0).toUpperCase() + form.billingCycle.slice(1)} billing
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${price}</p>
                      <p className="text-sm text-gray-600">per {form.billingCycle}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Tax (VAT)</h3>
                      <p className="text-sm text-gray-600">Based on your location</p>
                    </div>
                    <p className="font-medium">${(price * 0.15).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#AD0000]/5 rounded-lg">
                    <h3 className="font-medium">Total</h3>
                    <p className="text-xl font-bold">${(price * 1.15).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep('plan')}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Card Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <CardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={form.cardNumber}
                          onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={form.expiryDate}
                          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={form.cvv}
                          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Billing Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={form.postalCode}
                          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#AD0000] focus:border-[#AD0000]"
                        />
                      </div>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <p>{paymentError}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('review')}
                      className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
                    >
                      Complete Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {step === 'confirmation' && (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your subscription has been successfully activated. You can now access all features of
                your {form.plan} plan.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span>{form.plan} Plan</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>
                    {form.billingCycle.charAt(0).toUpperCase() + form.billingCycle.slice(1)} billing
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-400" />
                  <span>${(price * 1.15).toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-2 bg-[#AD0000] text-white rounded-lg hover:bg-[#AD0000]/90"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 