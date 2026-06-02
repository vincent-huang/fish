function getAPIBase() {
  return process.env.SEEDER_PAY_ENV === 'production'
    ? 'http://127.0.0.1:8077'
    : 'http://127.0.0.1:8076';
}

async function createCheckoutSession(productId, planId, buyerId, buyerEmail, buyerName) {
  const res = await fetch(getAPIBase() + '/pay/checkout/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.SEEDER_SK_KEY,
    },
    body: JSON.stringify({
      product_id: productId,
      plan_id: planId,
      buyer_id: buyerId,
      buyer_email: buyerEmail,
      buyer_name: buyerName,
      idempotency_key: 'node_' + Date.now(),
    }),
  });
  const json = await res.json();
  return json.data;
}

async function getOrderWithKey(orderId) {
  const res = await fetch(getAPIBase() + '/pay/order/' + orderId, {
    headers: { 'Authorization': 'Bearer ' + process.env.SEEDER_SK_KEY }
  });
  const json = await res.json();
  return json.data;
}

async function cancelSubscription(subscriptionId) {
  const res = await fetch(getAPIBase() + '/pay/subscriptions/' + subscriptionId + '/cancel', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + process.env.SEEDER_SK_KEY }
  });
  const json = await res.json();
  return json.data;
}

async function checkEntitlement(buyerEmail) {
  const res = await fetch(getAPIBase() + '/pay/subscriptions?buyer_email=' + encodeURIComponent(buyerEmail), {
    headers: { 'Authorization': 'Bearer ' + process.env.SEEDER_SK_KEY }
  });
  const json = await res.json();
  const subs = json.data?.subscriptions || [];
  return subs.flatMap(s => s.entitlement_keys || []);
}

async function listProducts(appId) {
  const res = await fetch(getAPIBase() + '/pay/products/plans?app_id=' + encodeURIComponent(appId), {
    headers: { 'Authorization': 'Bearer ' + process.env.SEEDER_SK_KEY }
  });
  const json = await res.json();
  return json.data;
}

async function listSubscriptions(buyerEmail) {
  const res = await fetch(getAPIBase() + '/pay/subscriptions?buyer_email=' + encodeURIComponent(buyerEmail), {
    headers: { 'Authorization': 'Bearer ' + process.env.SEEDER_SK_KEY }
  });
  const json = await res.json();
  return json.data?.subscriptions || [];
}

module.exports = { createCheckoutSession, getOrderWithKey, cancelSubscription, checkEntitlement, listProducts, listSubscriptions };
