import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { updateUserByStripeCustomerId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature' },
        { status: 400 }
      );
    }

    const stripe = await getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        await updateUserByStripeCustomerId(customerId, {
          stripe_subscription_id: subscriptionId,
          subscription_status: 'active',
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        let subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'inactive' = 'inactive';
        if (status === 'active' || status === 'trialing') {
          subscriptionStatus = 'active';
        } else if (status === 'canceled') {
          subscriptionStatus = 'canceled';
        } else if (status === 'past_due') {
          subscriptionStatus = 'past_due';
        }

        await updateUserByStripeCustomerId(customerId, {
          subscription_status: subscriptionStatus,
          subscription_end_date: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : undefined,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await updateUserByStripeCustomerId(customerId, {
          subscription_status: 'canceled',
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;

        await updateUserByStripeCustomerId(customerId, {
          subscription_status: 'past_due',
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
