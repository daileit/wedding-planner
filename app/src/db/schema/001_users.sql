-- Users and Admin Management Schema
-- Version: 001
-- Description: Core user authentication and role management

-- ==========================================
-- ENUMS
-- ==========================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),
    name            VARCHAR(255),
    image           TEXT,
    role            user_role DEFAULT 'user',
    status          user_status DEFAULT 'active',
    email_verified  TIMESTAMP WITH TIME ZONE,
    is_guest        BOOLEAN DEFAULT FALSE,
    last_login_at   TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ==========================================
-- OAUTH ACCOUNTS (for NextAuth.js)
-- ==========================================

CREATE TABLE IF NOT EXISTS accounts (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id             VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type                VARCHAR(50) NOT NULL,
    provider            VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token       TEXT,
    access_token        TEXT,
    expires_at          INTEGER,
    token_type          VARCHAR(50),
    scope               TEXT,
    id_token            TEXT,
    session_state       TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- ==========================================
-- SESSIONS (for NextAuth.js)
-- ==========================================

CREATE TABLE IF NOT EXISTS sessions (
    id            VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id       VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires       TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);

-- ==========================================
-- VERIFICATION TOKENS (for email verification)
-- ==========================================

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier VARCHAR(255) NOT NULL,
    token      VARCHAR(255) UNIQUE NOT NULL,
    expires    TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(identifier, token)
);

-- ==========================================
-- PASSWORD RESET TOKENS
-- ==========================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id    VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(255) UNIQUE NOT NULL,
    expires    TIMESTAMP WITH TIME ZONE NOT NULL,
    used       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id);

-- ==========================================
-- ADMIN AUDIT LOG
-- ==========================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    admin_id    VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id   VARCHAR(36),
    details     JSONB,
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at);
