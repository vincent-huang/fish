const { checkEntitlement } = require('./seeder_api');

async function entitlementMiddleware(req, res, next) {
  const email = req.user?.email;
  if (!email) {
    return res.redirect('/pricing');
  }

  try {
    const entitlements = await checkEntitlement(email);
    if (!entitlements || entitlements.length === 0) {
      return res.redirect('/pricing');
    }
    req.entitlements = entitlements;
    next();
  } catch (err) {
    console.error('[Entitlement] Check failed:', err.message);
    return res.redirect('/pricing');
  }
}

module.exports = { entitlementMiddleware };
