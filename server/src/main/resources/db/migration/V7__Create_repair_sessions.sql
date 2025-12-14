-- Create repair_sessions table
CREATE TABLE IF NOT EXISTS repair_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'RECEIVED',
    received_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_return_date TIMESTAMP,
    note TEXT,
    assigned_to UUID,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_repair_sessions_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    CONSTRAINT fk_repair_sessions_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_repair_sessions_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_repair_sessions_device_id ON repair_sessions(device_id);
CREATE INDEX idx_repair_sessions_status ON repair_sessions(status);
CREATE INDEX idx_repair_sessions_assigned_to ON repair_sessions(assigned_to);

-- Add trigger for updated_at
CREATE TRIGGER trg_repair_sessions_updated_at
BEFORE UPDATE ON repair_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add repair_session_id to repair_items, transactions, warranties (nullable for migration)
ALTER TABLE repair_items ADD COLUMN repair_session_id UUID;
ALTER TABLE transactions ADD COLUMN repair_session_id UUID;
ALTER TABLE warranties ADD COLUMN repair_session_id UUID;

ALTER TABLE repair_items ADD CONSTRAINT fk_repair_items_session FOREIGN KEY (repair_session_id) REFERENCES repair_sessions(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_session FOREIGN KEY (repair_session_id) REFERENCES repair_sessions(id) ON DELETE CASCADE;
ALTER TABLE warranties ADD CONSTRAINT fk_warranties_session FOREIGN KEY (repair_session_id) REFERENCES repair_sessions(id) ON DELETE CASCADE;

CREATE INDEX idx_repair_items_session_id ON repair_items(repair_session_id);
CREATE INDEX idx_transactions_session_id ON transactions(repair_session_id);
CREATE INDEX idx_warranties_session_id ON warranties(repair_session_id);

-- Seed one repair_session per existing device (using device data)
INSERT INTO repair_sessions (id, device_id, status, received_date, expected_return_date, note, assigned_to, created_by, created_at, updated_at, version)
SELECT gen_random_uuid(), d.id, d.status, d.received_date, d.expected_return_date, d.note, d.assigned_to, d.created_by, d.created_at, d.updated_at, d.version
FROM devices d;

-- Link existing repair_items, transactions, warranties to the latest session of their device
UPDATE repair_items ri
SET repair_session_id = rs.id
FROM repair_sessions rs
WHERE rs.device_id = ri.device_id
  AND rs.created_at = (SELECT MAX(created_at) FROM repair_sessions r2 WHERE r2.device_id = ri.device_id);

UPDATE transactions t
SET repair_session_id = rs.id
FROM repair_sessions rs
WHERE rs.device_id = t.device_id
  AND rs.created_at = (SELECT MAX(created_at) FROM repair_sessions r2 WHERE r2.device_id = t.device_id);

UPDATE warranties w
SET repair_session_id = rs.id
FROM repair_sessions rs
WHERE rs.device_id = w.device_id
  AND rs.created_at = (SELECT MAX(created_at) FROM repair_sessions r2 WHERE r2.device_id = w.device_id);

-- Enforce NOT NULL after migration
ALTER TABLE repair_items ALTER COLUMN repair_session_id SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN repair_session_id SET NOT NULL;
ALTER TABLE warranties ALTER COLUMN repair_session_id SET NOT NULL;







