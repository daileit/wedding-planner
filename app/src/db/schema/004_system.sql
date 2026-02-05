-- Seed Data
-- Version: 004
-- Description: Default templates and seed data

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
