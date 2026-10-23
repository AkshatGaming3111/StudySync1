/**
 * StudySync AI Educational Suite - Billing & Subscription Service
 * Supports Stripe, Lemon Squeezy, and local test sandbox checkouts
 */
const crypto = require('crypto');

// Plan Catalog
const PLANS = {
  explorer: {
    id: 'explorer',
    name: 'Explorer Free',
    tagline: 'Foundational Habit & Syllabus Tracking',
    priceMonthly: 0,
    priceAnnual: 0,
    badge: 'Free Forever',
    features: [
      '1 Active Course Syllabus Deconstruction',
      '25 Daily Socratic StudyBot 3.0 Prompts',
      'Standard Pomodoro Sanctuary (Rain & Binaural Waves)',
      'Local SyncBoard Whiteboard Canvas',
      'Basic Daily Habit Streaks'
    ],
    limits: {
      syllabi: 1,
      dailyAiQueries: 25,
      focusLockExtension: false,
      syncboardOcr: false,
      diagnosticArena: false
    }
  },
  scholar_pro: {
    id: 'scholar_pro',
    name: 'Scholar Pro',
    tagline: 'High-Impact Academic Focus & Exam Mastery',
    priceMonthly: 9.99,
    priceAnnual: 78.00, // $6.50/mo equivalent (35% savings)
    stripeMonthlyPriceId: process.env.STRIPE_PRICE_SCHOLAR_MONTHLY || 'price_scholar_pro_monthly',
    stripeAnnualPriceId: process.env.STRIPE_PRICE_SCHOLAR_ANNUAL || 'price_scholar_pro_annual',
    lemonMonthlyVariantId: process.env.LEMON_VARIANT_SCHOLAR_MONTHLY || 'variant_scholar_monthly',
    lemonAnnualVariantId: process.env.LEMON_VARIANT_SCHOLAR_ANNUAL || 'variant_scholar_annual',
    badge: 'Most Popular • 98.4% Score Boost',
    features: [
      'Unlimited AI Syllabus Deconstructions',
      'Chrome Focus Lock Companion (Anti-Tab Switch Guard)',
      'SyncBoard AI OCR: Handwriting & Diagrams to LaTeX',
      'AI Diagnostic Exam Arena with Score Prediction',
      'StudyBot 3.0 Turing & Franklin Socratic Personas',
      'Low-Latency Priority Gemini 1.5 Flash & Pro Routing',
      'Full Screen Time & Study Velocity Telemetry'
    ],
    limits: {
      syllabi: 999999,
      dailyAiQueries: 999999,
      focusLockExtension: true,
      syncboardOcr: true,
      diagnosticArena: true
    }
  },
  study_squad: {
    id: 'study_squad',
    name: 'Study Squad & Campus',
    tagline: 'Peer Collaboration & Institutional Intelligence',
    priceMonthly: 19.99,
    priceAnnual: 156.00, // $13/mo equivalent
    stripeMonthlyPriceId: process.env.STRIPE_PRICE_SQUAD_MONTHLY || 'price_study_squad_monthly',
    stripeAnnualPriceId: process.env.STRIPE_PRICE_SQUAD_ANNUAL || 'price_study_squad_annual',
    badge: 'Best for Groups & Schools',
    features: [
      'Everything in Scholar Pro for up to 5 Students',
      'Multiplayer SyncBoard Rooms with Live Voice & OCR',
      'Shared Syllabus Milestones & Group Study Leaderboards',
      'Faculty Rubric Auto-Grading Studio Access',
      'Student Attrition & Exam Risk Prediction Radar',
      'Canvas, Google Classroom & Moodle LTI 1.3 Sync',
      'Dedicated Priority Pedagogical Support'
    ],
    limits: {
      syllabi: 999999,
      dailyAiQueries: 999999,
      seats: 5,
      facultyStudio: true,
      lmsSync: true
    }
  }
};

// Promotional Coupons
const VALID_COUPONS = {
  STUDYSYNC30: { discountPercent: 30, description: '30% Off Launch Special' },
  EXAMREADY: { discountPercent: 20, description: '20% Off Finals Cram Season' },
  FACULTY100: { discountPercent: 100, description: '100% Off Verified Educator Pilot' }
};

// In-Memory Test State (persistent during server lifecycle)
const subscriptionsDb = new Map();
const enterpriseInquiries = [];

/**
 * Validates a coupon code
 */
function applyCoupon(code) {
  if (!code) return { valid: false, discountPercent: 0 };
  const cleaned = code.trim().toUpperCase();
  if (VALID_COUPONS[cleaned]) {
    return {
      valid: true,
      code: cleaned,
      discountPercent: VALID_COUPONS[cleaned].discountPercent,
      description: VALID_COUPONS[cleaned].description
    };
  }
  return { valid: false, error: 'Invalid or expired promotional code.' };
}

/**
 * Creates a checkout session (Stripe or Sandbox)
 */
async function createCheckoutSession({ planId, billingCycle = 'monthly', email, couponCode = '' }) {
  const plan = PLANS[planId];
  if (!plan) {
    throw new Error(`Plan "${planId}" not found`);
  }

  const basePrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const couponResult = applyCoupon(couponCode);
  const discountMultiplier = couponResult.valid ? (100 - couponResult.discountPercent) / 100 : 1;
  const finalPrice = Math.max(0, +(basePrice * discountMultiplier).toFixed(2));

  const sessionId = 'cs_' + crypto.randomBytes(12).toString('hex');

  // If Stripe is configured in .env, generate a real Stripe session
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `StudySync ${plan.name} (${billingCycle.toUpperCase()})`,
              description: plan.tagline,
              images: ['https://raw.githubusercontent.com/AkshatGaming3111/StudySync1/main/public/favicon.svg']
            },
            unit_amount: Math.round(finalPrice * 100),
            recurring: { interval: billingCycle === 'annual' ? 'year' : 'month' }
          },
          quantity: 1
        }],
        mode: 'subscription',
        success_url: `${process.env.SUITE_URL || 'http://localhost:3000'}/?checkout=success&session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
        cancel_url: `${process.env.SUITE_URL || 'http://localhost:3000'}/?checkout=canceled`
      });

      return {
        mode: 'stripe_live',
        sessionId: session.id,
        checkoutUrl: session.url,
        planId,
        billingCycle,
        amountDue: finalPrice
      };
    } catch (err) {
      console.warn('⚠️ Stripe API call failed, falling back to Sandbox checkout:', err.message);
    }
  }

  // Sandbox / Test Checkout Simulation
  const mockRecord = {
    sessionId,
    userEmail: email || 'student@studysync.ai',
    planId,
    planName: plan.name,
    billingCycle,
    basePrice,
    finalPrice,
    couponApplied: couponResult.valid ? couponResult.code : null,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  subscriptionsDb.set(sessionId, mockRecord);

  return {
    mode: 'sandbox_instant',
    sessionId,
    planId,
    planName: plan.name,
    billingCycle,
    amountDue: finalPrice,
    currency: 'USD',
    featuresUnlocked: plan.features,
    checkoutUrl: `/?checkout=sandbox_modal&session_id=${sessionId}&plan=${planId}`
  };
}

/**
 * Completes a test checkout instantly
 */
function completeTestCheckout(sessionId) {
  const record = subscriptionsDb.get(sessionId);
  if (!record) {
    // Auto-create for instant test flow
    const autoRecord = {
      sessionId,
      userEmail: 'scholar@studysync.ai',
      planId: 'scholar_pro',
      status: 'active',
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    subscriptionsDb.set(sessionId, autoRecord);
    return autoRecord;
  }
  record.status = 'active';
  record.activatedAt = new Date().toISOString();
  record.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return record;
}

/**
 * Handles Webhook Events from Stripe or Lemon Squeezy
 */
function handleWebhook(gateway, eventPayload, signature) {
  console.log(`[Billing Webhook] Received ${gateway} event`);

  // Verify HMAC signature if in production
  if (gateway === 'lemon_squeezy' && process.env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
    const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(JSON.stringify(eventPayload)).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature || '', 'utf8');
    if (!crypto.timingSafeEqual(digest, checksum)) {
      throw new Error('Invalid Lemon Squeezy Webhook Signature');
    }
  }

  return {
    received: true,
    processedAt: new Date().toISOString(),
    event: eventPayload.type || eventPayload.meta?.event_name || 'test_ping'
  };
}

/**
 * Records an Institutional / B2B Inquiry
 */
function recordEnterpriseInquiry(data) {
  const inquiry = {
    id: 'inq_' + crypto.randomBytes(8).toString('hex'),
    name: data.name,
    institution: data.institution,
    email: data.email,
    estimatedSeats: data.seats || '50-250',
    currentLms: data.lms || 'Canvas',
    message: data.message || '',
    receivedAt: new Date().toISOString()
  };
  enterpriseInquiries.push(inquiry);
  return inquiry;
}

module.exports = {
  PLANS,
  applyCoupon,
  createCheckoutSession,
  completeTestCheckout,
  handleWebhook,
  recordEnterpriseInquiry,
  subscriptionsDb
};
