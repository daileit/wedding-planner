-- System Configuration Schema
-- Version: 003
-- Description: App settings and migration tracking

-- ==========================================
-- SYSTEM OPTIONS (WordPress-style wp_options)
-- ==========================================

CREATE TABLE IF NOT EXISTS system_options (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    option_name VARCHAR(255) UNIQUE NOT NULL,
    option_value TEXT,
    autoload    BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_options_name ON system_options(option_name);
CREATE INDEX IF NOT EXISTS idx_options_autoload ON system_options(autoload);

-- ==========================================
-- MIGRATIONS TRACKING
-- ==========================================

CREATE TABLE IF NOT EXISTS migrations (
    id          SERIAL PRIMARY KEY,
    version     VARCHAR(50) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checksum    VARCHAR(64),
    success     BOOLEAN DEFAULT TRUE,
    UNIQUE(version)
);

-- ==========================================
-- INSERT DEFAULT OPTIONS
-- ==========================================

INSERT INTO system_options (option_name, option_value, autoload)
VALUES 
    ('db_version', '1.0.0', true),
    ('site_name', 'WedBeLoving', true),
    ('site_description', 'Your perfect wedding planner', true),
    ('default_currency', 'USD', true),
    ('allow_registration', 'true', true),
    ('allow_guest_plans', 'true', true),
    ('max_plans_per_user', '10', true),
    ('installed_at', CURRENT_TIMESTAMP::text, true)
ON CONFLICT (option_name) DO NOTHING;

-- ==========================================
-- INSERT DEFAULT PLAN TEMPLATES
-- ==========================================

INSERT INTO plan_templates (id, name, description, plan_type, data, is_public)
VALUES 
    (
        'tpl_wedding_basic',
        'Basic Wedding',
        'A simple wedding plan with essential categories',
        'wedding',
        '{
            "categories": [
                {"name": "Venue", "budget": 5000, "color": "#FF6B6B"},
                {"name": "Catering", "budget": 3000, "color": "#4ECDC4"},
                {"name": "Photography", "budget": 2000, "color": "#45B7D1"},
                {"name": "Music & Entertainment", "budget": 1500, "color": "#96CEB4"},
                {"name": "Flowers & Decor", "budget": 1500, "color": "#FFEAA7"},
                {"name": "Attire", "budget": 2000, "color": "#DDA0DD"},
                {"name": "Invitations", "budget": 500, "color": "#98D8C8"},
                {"name": "Miscellaneous", "budget": 1500, "color": "#B8B8B8"}
            ],
            "checklist": [
                {"task": "Set wedding date", "category": "Planning"},
                {"task": "Create guest list", "category": "Planning"},
                {"task": "Book venue", "category": "Venue"},
                {"task": "Hire photographer", "category": "Photography"},
                {"task": "Choose catering", "category": "Catering"},
                {"task": "Send invitations", "category": "Invitations"}
            ]
        }'::jsonb,
        true
    ),
    (
        'tpl_party_simple',
        'Simple Party',
        'A basic party planning template',
        'party',
        '{
            "categories": [
                {"name": "Venue", "budget": 500, "color": "#FF6B6B"},
                {"name": "Food & Drinks", "budget": 300, "color": "#4ECDC4"},
                {"name": "Decorations", "budget": 100, "color": "#45B7D1"},
                {"name": "Entertainment", "budget": 200, "color": "#96CEB4"}
            ],
            "checklist": [
                {"task": "Set date and time", "category": "Planning"},
                {"task": "Create guest list", "category": "Planning"},
                {"task": "Book venue or prepare space", "category": "Venue"},
                {"task": "Plan menu", "category": "Food & Drinks"},
                {"task": "Send invitations", "category": "Planning"}
            ]
        }'::jsonb,
        true
    )
ON CONFLICT DO NOTHING;
