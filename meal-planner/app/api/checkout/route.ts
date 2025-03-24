import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import stripe from '@/lib/stripe';
import { getPriceIdFromInterval } from '@/lib/plans';

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { interval } = await req.json();
  const priceId = getPriceIdFromInterval(interval);

  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: user.emailAddresses[0]?.emailAddress,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/meal-plan?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=1`,
    metadata: {
      clerkUserId: user.id,
      interval,
    },
  });

  return NextResponse.json({ url: session.url });
}