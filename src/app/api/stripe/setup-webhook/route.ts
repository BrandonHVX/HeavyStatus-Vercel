import { NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';

export async function GET(request: Request) {
  try {
    const stripe = await getStripeClient();
    
    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || 
                   request.headers.get('host') || 
                   'localhost:5000';
    
    const webhookUrl = `https://${domain}/api/stripe/webhook`;
    
    const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const existing = existingWebhooks.data.find(w => w.url === webhookUrl);
    
    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook already exists',
        webhookId: existing.id,
        webhookUrl: existing.url,
        secret: 'Check your Stripe dashboard for the signing secret'
      });
    }
    
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
      ],
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook created successfully',
      webhookId: webhook.id,
      webhookUrl: webhook.url,
      secret: webhook.secret,
      note: 'Save the secret as STRIPE_WEBHOOK_SECRET in your environment'
    });
  } catch (error: any) {
    console.error('Webhook setup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to setup webhook' },
      { status: 500 }
    );
  }
}
