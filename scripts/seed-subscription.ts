import Stripe from 'stripe';

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', 'stripe');
  url.searchParams.set('environment', 'development');

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X_REPLIT_TOKEN': xReplitToken
    }
  });

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings?.settings?.secret) {
    throw new Error('Stripe connection not found');
  }

  return connectionSettings.settings.secret;
}

async function seedSubscription() {
  console.log('Getting Stripe credentials...');
  const secretKey = await getCredentials();
  
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil' as any,
  });

  console.log('Checking for existing subscription product...');
  
  const existingProducts = await stripe.products.search({
    query: "name:'Political Aficionado Premium'"
  });

  if (existingProducts.data.length > 0) {
    console.log('Subscription product already exists!');
    const product = existingProducts.data[0];
    
    const prices = await stripe.prices.list({
      product: product.id,
      active: true
    });
    
    if (prices.data.length > 0) {
      console.log('\n=== EXISTING SUBSCRIPTION ===');
      console.log('Product ID:', product.id);
      console.log('Price ID:', prices.data[0].id);
      console.log('Amount:', (prices.data[0].unit_amount! / 100).toFixed(2), prices.data[0].currency.toUpperCase());
      console.log('\nAdd this to your environment:');
      console.log(`STRIPE_PRICE_ID=${prices.data[0].id}`);
      return;
    }
  }

  console.log('Creating subscription product...');
  const product = await stripe.products.create({
    name: 'Political Aficionado Premium',
    description: 'Monthly subscription for unlimited access to exclusive political analysis and premium content.',
    metadata: {
      type: 'subscription',
      tier: 'premium'
    }
  });

  console.log('Creating $9.99/month price...');
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 999,
    currency: 'usd',
    recurring: {
      interval: 'month'
    },
    metadata: {
      display_name: 'Monthly Premium'
    }
  });

  console.log('\n=== SUBSCRIPTION CREATED ===');
  console.log('Product ID:', product.id);
  console.log('Price ID:', price.id);
  console.log('Amount: $9.99/month');
  console.log('\nAdd this to your environment:');
  console.log(`STRIPE_PRICE_ID=${price.id}`);
}

seedSubscription().catch(console.error);
