'use client';
import { CreditCard, RefreshCw, Zap, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast-context';
import { BASE_URL } from '@/lib/utils';
import { SectionWrapper } from '../SectionWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useSWR from 'swr';
import { Subscription } from '@/types';

export function SubscriptionSection() {
  const router = useRouter();
  const { showToast } = useToast();

  const { data: subscription, error, isLoading, mutate } = useSWR<Subscription>(
    `${BASE_URL}/api/v1/subscriptions/current`,
    async (url: string | URL | Request) => {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch subscription');
      return res.json();
    }
  );

  const handleUpgrade = (planId: string) => {
    router.push(`/pricing?upgrade=${planId}`);
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/v1/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');
      
      mutate();
      showToast('Subscription cancelled successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleReactivate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/subscriptions/reactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to reactivate subscription');
      
      mutate();
      showToast('Subscription reactivated successfully', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  if (error) return <div>Failed to load subscription</div>;

  return (
    <SectionWrapper 
      icon={<CreditCard className="w-5 h-5" />} 
      title="Subscription Management"
      actionButton={
        !isLoading && subscription?.status === 'active' && (
          <Button 
            variant="outline" 
            onClick={() => handleUpgrade(subscription.plan_id)}
            className="text-[#AD0000] border-[#AD0000] hover:bg-[#AD0000]/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        )
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-32" />
        </div>
      ) : subscription ? (
        <div className="space-y-6">
          {/* Current Plan Card */}
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{subscription.plan_name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {subscription.status === 'active' ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active (${subscription.amount/100}/{subscription.interval})
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="w-4 h-4 mr-1" />
                      {subscription.status === 'cancelled' ? 'Cancelled' : 'Inactive'}
                    </span>
                  )}
                </p>
                {subscription.next_billing_date && (
                  <p className="text-sm text-gray-500 mt-2">
                    Next billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-2xl font-bold">
                ${subscription.amount/100}
                <span className="text-sm font-normal text-gray-500">/{subscription.interval}</span>
              </div>
            </div>

            {/* Features List */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscription.features?.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {subscription.status === 'active' ? (
              <>
                <Button 
                  onClick={() => handleUpgrade(subscription.plan_id)}
                  variant="default"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Cancel Subscription
                </Button>
              </>
            ) : subscription.status === 'cancelled' ? (
              <Button 
                onClick={handleReactivate}
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reactivate Subscription
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/pricing')}
                variant="default"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            )}
          </div>

          {/* Billing History Preview */}
          {subscription.payment_history && subscription.payment_history?.length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium mb-3">Recent Payments</h4>
              <div className="space-y-3">
                {subscription.payment_history.slice(0, 3).map(payment => (
                  <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${payment.amount/100}</p>
                      <p className={`text-xs ${
                        payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="link" 
                className="text-[#AD0000] mt-2 pl-0"
                onClick={() => router.push('/dashboard/billing')}
              >
                View full billing history
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No active subscription</h3>
          <p className="text-gray-500 mb-4">Get started with one of our plans</p>
          <Button onClick={() => router.push('/pricing')}>
            View Pricing Plans
          </Button>
        </div>
      )}
    </SectionWrapper>
  );
}