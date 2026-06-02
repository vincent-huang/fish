const crypto = require('crypto');

function verifySignature(rawBody, signature) {
  const secret = process.env.SEEDER_WEBHOOK_SECRET;
  if (!secret) return true; // Skip in dev

  const parts = signature.split(',').map(s => s.split('=')[1]);
  if (parts.length !== 2) return false;
  const [timestamp, sig] = parts;
  const payload = timestamp + '.' + rawBody.toString('utf8');
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

async function handleOrderPaid(data) {
  console.log('[Seeder Webhook] Order paid:', data.order_id, 'by buyer:', data.buyer_id);
}

async function handleOrderRefunded(data) {
  console.log('[Seeder Webhook] Order refunded:', data.order_id);
}

async function handleSubscriptionCreated(data) {
  console.log('[Seeder Webhook] Subscription created:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleSubscriptionTrialStarted(data) {
  console.log('[Seeder Webhook] Trial started:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleSubscriptionTrialWillEnd(data) {
  console.log('[Seeder Webhook] Trial will end:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleSubscriptionRenewed(data) {
  console.log('[Seeder Webhook] Subscription renewed:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleSubscriptionPaymentFailed(data) {
  console.log('[Seeder Webhook] Payment failed:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleSubscriptionUpdated(data) {
  console.log('[Seeder Webhook] Subscription updated:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleSubscriptionCancelled(data) {
  console.log('[Seeder Webhook] Subscription cancelled:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleSubscriptionExpired(data) {
  console.log('[Seeder Webhook] Subscription expired:', data.subscription_id, 'for buyer:', data.buyer_id);
}

async function handleCustomerCreated(data) {
  console.log('[Seeder Webhook] Customer created:', data.buyer_id);
}

async function handleSeederWebhook(req, res) {
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(JSON.stringify(req.body), 'utf8');

  const signature = req.headers['seeder-webhook-signature'];
  if (!verifySignature(rawBody, signature)) {
    return res.status(401).json({ error: 'invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'invalid json body' });
  }

  const { event, data } = payload;

  switch (event) {
    case 'order.paid':
      await handleOrderPaid(data);
      break;
    case 'order.refunded':
      await handleOrderRefunded(data);
      break;
    case 'subscription.created':
      await handleSubscriptionCreated(data);
      break;
    case 'subscription.trial_started':
      await handleSubscriptionTrialStarted(data);
      break;
    case 'subscription.trial_will_end':
      await handleSubscriptionTrialWillEnd(data);
      break;
    case 'subscription.renewed':
      await handleSubscriptionRenewed(data);
      break;
    case 'subscription.payment_failed':
      await handleSubscriptionPaymentFailed(data);
      break;
    case 'subscription.updated':
      await handleSubscriptionUpdated(data);
      break;
    case 'subscription.cancelled':
      await handleSubscriptionCancelled(data);
      break;
    case 'subscription.expired':
      await handleSubscriptionExpired(data);
      break;
    case 'customer.created':
      await handleCustomerCreated(data);
      break;
    default:
      console.log('[Seeder Webhook] Unknown event:', event);
  }

  res.json({ received: true, event });
}

module.exports = { handleSeederWebhook };
