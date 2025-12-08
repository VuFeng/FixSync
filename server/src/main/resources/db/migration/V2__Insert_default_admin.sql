-- Insert default admin user
-- Password: admin123 (BCrypt hash)
-- You should change this password after first login
-- Note: Using a fixed UUID for the default admin user
INSERT INTO users (id, full_name, email, password_hash, role, is_active, created_at, updated_at, version)
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Administrator',
    'admin@fixsync.com',
    '$2a$10$mF.dO8uVDiqmIP4tv/wKGuFz/dOA8/k2jUZKPTOgqD0.4hjZY0kg.',
    'ADMIN',
    TRUE,
    NOW(),
    NOW(),
    0
) ON CONFLICT (email) DO NOTHING;

