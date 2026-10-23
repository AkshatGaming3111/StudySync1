-- ============================================================================
-- StudySync – AI Educational Suite: Enterprise Database Schema
-- Compatible with PostgreSQL 15+, Supabase, and AWS Aurora
-- Includes Row Level Security (RLS) policies for multi-tenant student data isolation
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS & IDENTITY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(128),
    avatar_url TEXT,
    role VARCHAR(32) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'institution_admin', 'super_admin')),
    timezone VARCHAR(64) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTIONS & COMMERCIAL ENTITLEMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(64) NOT NULL DEFAULT 'explorer' CHECK (plan IN ('explorer', 'scholar_pro', 'study_squad', 'campus_enterprise')),
    billing_cycle VARCHAR(16) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime')),
    status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'paused')),
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(128),
    stripe_subscription_id VARCHAR(128) UNIQUE,
    lemon_squeezy_order_id VARCHAR(128),
    seat_limit INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user ON user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_stripe_cust ON user_entitlements(stripe_customer_id);

-- ----------------------------------------------------------------------------
-- 3. BILLING TRANSACTIONS & AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    gateway VARCHAR(32) NOT NULL CHECK (gateway IN ('stripe', 'lemon_squeezy', 'razorpay', 'test')),
    transaction_id VARCHAR(128) UNIQUE NOT NULL,
    amount_cents INT NOT NULL,
    currency VARCHAR(8) DEFAULT 'USD',
    event_type VARCHAR(64) NOT NULL, -- e.g. 'checkout.session.completed', 'invoice.paid'
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_billing_tx_user ON billing_transactions(user_id);

-- ----------------------------------------------------------------------------
-- 4. INSTITUTIONS & CAMPUS SEATS (B2B SaaS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    domain VARCHAR(128), -- e.g. 'stanford.edu' for automatic SSO domain matching
    seat_quota INT DEFAULT 50,
    seats_assigned INT DEFAULT 0,
    lms_provider VARCHAR(32) CHECK (lms_provider IN ('canvas', 'blackboard', 'moodle', 'google_classroom', 'none')),
    lms_config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Institution Memberships
CREATE TABLE IF NOT EXISTS institution_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(32) DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'coordinator')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 5. WEBSITE 1: AI SMART STUDY PLANNER TELEMETRY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS syllabi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    raw_text TEXT,
    gemini_breakdown JSONB, -- Decomposed sub-topics, milestones, estimated hours
    target_exam_date DATE,
    completion_percentage NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    syllabus_id UUID REFERENCES syllabi(id) ON DELETE SET NULL,
    duration_minutes INT NOT NULL,
    soundscape_preset VARCHAR(64) DEFAULT 'rain',
    distractions_blocked INT DEFAULT 0,
    xp_earned INT DEFAULT 50,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_focus_user_completed ON focus_sessions(user_id, completed_at);

-- ----------------------------------------------------------------------------
-- 6. WEBSITE 2: AI INTERACTIVE CLASSROOM & SYNCBOARD
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS syncboard_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_name VARCHAR(128) NOT NULL,
    access_code VARCHAR(16) UNIQUE,
    canvas_state JSONB DEFAULT '{}'::jsonb,
    ocr_transcriptions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    assignment_title VARCHAR(255) NOT NULL,
    rubric_criteria JSONB NOT NULL,
    submission_text TEXT,
    ai_feedback_summary TEXT,
    ai_calculated_score NUMERIC(5,2),
    faculty_override_score NUMERIC(5,2),
    status VARCHAR(32) DEFAULT 'evaluated' CHECK (status IN ('pending', 'evaluated', 'verified_by_faculty')),
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diagnostic_exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(128) NOT NULL,
    score_percentage NUMERIC(5,2) NOT NULL,
    predicted_grade_band VARCHAR(16), -- e.g. 'A+', '99th Percentile'
    weakness_areas JSONB DEFAULT '[]'::jsonb,
    tested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabi ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE syncboard_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_exam_results ENABLE ROW LEVEL SECURITY;

-- Sample policy: Users can only read and update their own data
CREATE POLICY "Users can only access own profile" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own entitlements" ON user_entitlements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own syllabi" ON syllabi
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own focus sessions" ON focus_sessions
    FOR ALL USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 8. HELPER VIEW: ACTIVE USER SUBSCRIPTION VIEW
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_user_active_tier AS
SELECT 
    u.id AS user_id,
    u.email,
    u.full_name,
    COALESCE(e.plan, 'explorer') AS current_plan,
    COALESCE(e.status, 'active') AS subscription_status,
    e.current_period_end,
    CASE 
        WHEN e.plan IN ('scholar_pro', 'study_squad', 'campus_enterprise') AND e.status = 'active' THEN TRUE 
        ELSE FALSE 
    END AS is_pro_access
FROM users u
LEFT JOIN user_entitlements e ON u.id = e.user_id;
