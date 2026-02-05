-- Foreign Key Constraints
-- Version: 004
-- Description: Add all foreign key constraints after tables are created

-- ==========================================
-- PLANS TABLE CONSTRAINTS
-- ==========================================

ALTER TABLE plans
    ADD CONSTRAINT fk_plans_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) ON DELETE CASCADE;

-- ==========================================
-- PLAN TEMPLATES CONSTRAINTS
-- ==========================================

ALTER TABLE plan_templates
    ADD CONSTRAINT fk_templates_created_by 
    FOREIGN KEY (created_by) 
    REFERENCES users(id) ON DELETE SET NULL;

-- ==========================================
-- PLAN SHARES CONSTRAINTS
-- ==========================================

ALTER TABLE plan_shares
    ADD CONSTRAINT fk_shares_plan_id 
    FOREIGN KEY (plan_id) 
    REFERENCES plans(id) ON DELETE CASCADE;

ALTER TABLE plan_shares
    ADD CONSTRAINT fk_shares_shared_with 
    FOREIGN KEY (shared_with) 
    REFERENCES users(id) ON DELETE CASCADE;
