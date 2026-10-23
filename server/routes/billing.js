const express = require('express');
const router = express.Router();
const billingService = require('../services/billingService');

// 1. Get Plan Catalog & Feature Matrix
router.get('/plans', (req, res) => {
  res.json({
    currency: 'USD',
    plans: Object.values(billingService.PLANS),
    annualDiscountPercent: 35
  });
});

// 2. Validate Promotional Coupon
router.post('/verify-coupon', (req, res) => {
  const { code } = req.body;
  const result = billingService.applyCoupon(code);
  if (!result.valid) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// 3. Initiate Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planId, billingCycle, email, couponCode } = req.body;
    if (!planId) {
      return res.status(400).json({ error: 'planId is required' });
    }

    const session = await billingService.createCheckoutSession({
      planId,
      billingCycle: billingCycle || 'monthly',
      email: email || 'student@studysync.ai',
      couponCode
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Checkout initialization failed', details: err.message });
  }
});

// 4. Complete Test / Sandbox Checkout
router.post('/complete-test-checkout', (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }
    const record = billingService.completeTestCheckout(sessionId);
    res.json({
      success: true,
      message: 'Subscription successfully activated!',
      subscription: record
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to activate test subscription', details: err.message });
  }
});

// 5. Query Subscription Status
router.get('/subscription-status', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.json({ status: 'explorer', isPro: false });
  }
  const record = billingService.subscriptionsDb.get(sessionId);
  if (record && record.status === 'active') {
    return res.json({
      status: 'active',
      isPro: true,
      planId: record.planId,
      planName: record.planName,
      activatedAt: record.activatedAt
    });
  }
  res.json({ status: 'pending', isPro: false });
});

// 6. Enterprise / Campus Pilot Inquiries
router.post('/enterprise-inquiry', (req, res) => {
  try {
    const { name, institution, email, seats, lms, message } = req.body;
    if (!name || !email || !institution) {
      return res.status(400).json({ error: 'Name, email, and institution are required fields.' });
    }
    const inquiry = billingService.recordEnterpriseInquiry({ name, institution, email, seats, lms, message });
    res.json({
      success: true,
      message: 'Institutional pilot request received! An academic solutions specialist will contact you within 24 hours.',
      inquiryId: inquiry.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record inquiry', details: err.message });
  }
});

// 7. Payment Gateway Webhook Receiver (Stripe & Lemon Squeezy)
router.post('/webhook', (req, res) => {
  try {
    const gateway = req.headers['x-lemon-squeezy-signature'] ? 'lemon_squeezy' : 'stripe';
    const signature = req.headers['stripe-signature'] || req.headers['x-lemon-squeezy-signature'];
    const result = billingService.handleWebhook(gateway, req.body, signature);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Webhook processing error', details: err.message });
  }
});

module.exports = router;
