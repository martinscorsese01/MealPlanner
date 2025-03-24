'use client';

const availablePlans = [
  {
    name: 'Weekly Plan',
    amount: 9.99,
    interval: 'week',
    description: 'Great if you want to try the service before committing longer.',
    features: ['Unlimited AI meal plans', 'AI nutrition insights', 'Cancel anytime'],
  },
  {
    name: 'Monthly Plan',
    amount: 39.99,
    interval: 'month',
    description: 'Best value for regular users.',
    features: ['Unlimited AI meal plans', 'AI nutrition insights', 'Priority support'],
    isPopular: true,
  },
  {
    name: 'Yearly Plan',
    amount: 299.99,
    interval: 'year',
    description: 'Ideal if you want to save over time.',
    features: ['Unlimited AI meal plans', 'AI nutrition insights', 'Annual check-ins'],
  },
];

export default function SubscribePage() {
  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16">
      <div>
        <h2 className="text-3xl font-bold text-center mt-12 sm:text-5xl tracking-tight">
          Pricing
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-xl text-center">
          Get started on our weekly plan or upgrade to monthly or yearly when you’re ready.
        </p>
      </div>

      <div className="mt-12 container mx-auto space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
        {availablePlans.map((plan, key) => (
          <div
            key={key}
            className="relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col hover:shadow-md hover:scale-[1.02] transition-transform duration-200 ease-out"
          >
            <div className="flex-1">
              {plan.isPopular && (
                <p className="absolute top-0 py-1.5 px-4 bg-emerald-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide transform -translate-y-1/2">
                  Most popular
                </p>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">${plan.amount}</span>
                <span className="ml-1 text-xl font-semibold">/{plan.interval}</span>
              </p>
              <p className="mt-6">{plan.description}</p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <span className="ml-3">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="mt-8 block w-full py-3 px-6 rounded-md font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled
            >
              Subscribe {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
