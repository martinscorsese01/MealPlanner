'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

type SubscribeResponse = { url: string };
type SubscribeError = { error: string };

const availablePlans = [
  {
    name: 'Weekly Plan',
    amount: 9.99,
    interval: 'week',
    description: 'Try before committing.',
    features: ['Unlimited meal plans', 'Nutrition insights'],
  },
  {
    name: 'Monthly Plan',
    amount: 39.99,
    interval: 'month',
    description: 'Most popular for regular users.',
    features: ['Unlimited plans', 'Priority AI support'],
    isPopular: true,
  },
  {
    name: 'Yearly Plan',
    amount: 299.99,
    interval: 'year',
    description: 'Best value long-term.',
    features: ['Unlimited plans', 'VIP support'],
  },
];

const subscribeToPlan = async ({
  planType,
  userId,
  email,
}: {
  planType: string;
  userId: string;
  email: string;
}): Promise<SubscribeResponse> => {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planType, userId, email }),
  });

  if (!res.ok) {
    const errorData: SubscribeError = await res.json();
    throw new Error(errorData.error || 'Something went wrong.');
  }

  return await res.json();
};

export default function SubscribePage() {
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id;
  const email = user?.emailAddresses?.[0]?.emailAddress || '';

  const mutation = useMutation<SubscribeResponse, Error, { planType: string }>({
    mutationFn: ({ planType }) => {
      if (!userId) throw new Error('User not signed in.');
      return subscribeToPlan({ planType, userId, email });
    },
    onMutate: () => toast.loading('Processing...', { id: 'subscribe' }),
    onSuccess: (data) => {
      toast.success('Redirecting...', { id: 'subscribe' });
      window.location.href = data.url;
    },
    onError: (error) => toast.error(error.message || 'Error occurred', { id: 'subscribe' }),
  });

  const handleSubscribe = (planType: string) => {
    if (!userId) {
      router.push('/sign-up');
      return;
    }

    mutation.mutate({ planType });
  };

  return (
    <div className="px-4 py-10">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-center">Pricing</h2>
      <p className="text-center text-lg mb-10">Choose a plan to get started.</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {availablePlans.map((plan, index) => (
          <div key={index} className="p-6 border rounded-xl shadow">
            {plan.isPopular && (
              <p className="text-sm font-semibold text-white bg-emerald-500 px-2 py-1 rounded-full mb-2">
                Most Popular
              </p>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-4xl font-extrabold">${plan.amount}</p>
            <p className="text-sm mb-4">Billed {plan.interval}ly</p>
            <p className="mb-4">{plan.description}</p>
            <ul className="text-sm space-y-1 mb-4">
              {plan.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.interval)}
              disabled={mutation.isPending}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded disabled:bg-gray-400"
            >
              {mutation.isPending ? 'Please wait...' : `Subscribe ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}