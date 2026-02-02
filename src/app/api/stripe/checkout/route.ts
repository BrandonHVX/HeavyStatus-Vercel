import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getUserByEmail, updateUserSubscription } from '@/lib/auth';
import { getStripeClient, SUBSCRIPTION_PRICE_ID } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be signed in to subscribe' },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const stripe = await getStripeClient();
    const { priceId } = await request.json();
    const finalPriceId = priceId || SUBSCRIPTION_PRICE_ID;

    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      
      await updateUserSubscription(user.id, {
        stripe_customer_id: customerId,
      });
    }

    const origin = request.headers.get('origin') || 'http://localhost:5000';
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: finalPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/account?success=true`,
      cancel_url: `${origin}/subscribe?canceled=true`,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
