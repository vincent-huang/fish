const express = require('express');
const path = require('path');

const {
  createCheckoutSession,
  getOrderWithKey,
  cancelSubscription,
  checkEntitlement,
  listProducts,
  listSubscriptions,
} = require('./server/seeder_api.cjs');

const { handleSeederWebhook } = require('./server/seeder_webhook.cjs');
const { entitlementMiddleware } = require('./server/entitlement.cjs');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_ID = '2ed524ba-5316-41ed-bc36-c4e1ee757ec5';

// Webhook endpoint — needs raw body for HMAC, before JSON parser
app.post('/api/webhooks/seeder', express.raw({ type: 'application/json' }), handleSeederWebhook);

// JSON body parser for API routes
app.use(express.json());

// ---- Seeder Monetization API Routes ----

// Get product plans for pricing page
app.get('/api/products/plans', async (req, res) => {
  try {
    const products = await listProducts(APP_ID);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user entitlements
app.get('/api/entitlements', async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'not authenticated' });
    const entitlements = await checkEntitlement(email);
    res.json({ entitlements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user subscriptions
app.get('/api/subscriptions', async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'not authenticated' });
    const subscriptions = await listSubscriptions(email);
    res.json({ subscriptions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create checkout session
app.post('/api/checkout', async (req, res) => {
  try {
    const { product_id, plan_id } = req.body;
    const email = req.user?.email || 'guest@example.com';
    const buyerId = req.user?.id || 'guest';
    const buyerName = req.user?.name || 'Guest';
    const session = await createCheckoutSession(product_id, plan_id, buyerId, email, buyerName);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order status
app.get('/api/order/:orderId', async (req, res) => {
  try {
    const order = await getOrderWithKey(req.params.orderId);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel subscription
app.post('/api/subscriptions/:id/cancel', async (req, res) => {
  try {
    const result = await cancelSubscription(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files (SPA)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
