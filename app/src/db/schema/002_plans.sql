-- Plans Schema (JSON-based flexible storage)
-- Version: 002
-- Description: User plans stored as JSON for flexibility

-- ==========================================
-- ENUMS
-- ==========================================

DO $$ BEGIN
    CREATE TYPE plan_status AS ENUM ('draft', 'active', 'completed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- PLANS TABLE (JSON-based)
-- ==========================================

CREATE TABLE IF NOT EXISTS plans (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id     VARCHAR(36) NOT NULL,
    
    -- Basic metadata (indexed for queries)
    title       VARCHAR(255) NOT NULL,
    plan_type   VARCHAR(50) DEFAULT 'wedding',
    status      plan_status DEFAULT 'draft',
    event_date  DATE,
    
    -- All plan data stored as JSON (unstructured, flexible)
    -- Can include: budget, categories, items, vendors, guests, timeline, etc.
    data        JSONB NOT NULL DEFAULT '{}',
    
    -- Computed/cached values for quick queries
    total_budget    DECIMAL(15,2) DEFAULT 0,
    spent_amount    DECIMAL(15,2) DEFAULT 0,
    items_count     INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plans_user ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_type ON plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_plans_event_date ON plans(event_date);
CREATE INDEX IF NOT EXISTS idx_plans_created ON plans(created_at);

-- GIN index for JSON queries
CREATE INDEX IF NOT EXISTS idx_plans_data ON plans USING GIN(data);

-- ==========================================
-- PLAN TEMPLATES (Pre-built starting points)
-- ==========================================

CREATE TABLE IF NOT EXISTS plan_templates (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    plan_type   VARCHAR(50) NOT NULL,
    data        JSONB NOT NULL DEFAULT '{}',
    is_public   BOOLEAN DEFAULT TRUE,
    created_by  VARCHAR(36),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_type ON plan_templates(plan_type);
CREATE INDEX IF NOT EXISTS idx_templates_public ON plan_templates(is_public);

-- ==========================================
-- PLAN SHARES (Collaboration)
-- ==========================================

CREATE TABLE IF NOT EXISTS plan_shares (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    plan_id     VARCHAR(36) NOT NULL,
    shared_with VARCHAR(36),
    share_email VARCHAR(255),
    share_token VARCHAR(255) UNIQUE,
    can_edit    BOOLEAN DEFAULT FALSE,
    expires_at  TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shares_plan ON plan_shares(plan_id);
CREATE INDEX IF NOT EXISTS idx_shares_user ON plan_shares(shared_with);
CREATE INDEX IF NOT EXISTS idx_shares_token ON plan_shares(share_token);
