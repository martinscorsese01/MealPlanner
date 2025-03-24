import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import {stripe} from '@/lib/stripe';
import {prisma} from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.clerkUserId;
      const subscriptionId = session.subscription;
      const interval = session.metadata?.interval;

      if (!userId) break;

      await prisma.profile.update({
        where: { userId },
        data: {
          subscriptionActive: true,
          stripeSubscriptionId: subscriptionId,
          subscriptionTier: interval,
        },
      });

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;

      await prisma.profile.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          subscriptionActive: false,
          subscriptionTier: null,
          stripeSubscriptionId: null,
        },
      });

      break;
    }

    // Optional: handle payment failure
    case 'invoice.payment_failed': {
      // TODO: flag user or notify
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
