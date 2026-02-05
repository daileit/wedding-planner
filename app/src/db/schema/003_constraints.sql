-- Triggers (After all tables and constraints exist)
-- Version: 003
-- Description: Create triggers for automatic timestamp updates

-- ==========================================
-- TRIGGER: Auto-update timestamps on plans
-- ==========================================

DROP TRIGGER IF EXISTS trigger_plans_updated ON plans;
CREATE TRIGGER trigger_plans_updated
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
