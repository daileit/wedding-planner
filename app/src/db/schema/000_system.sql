-- System Configuration Schema (MUST RUN FIRST)
-- Version: 000
-- Description: System tables required for migration tracking

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
