-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    imei VARCHAR(50),
    color VARCHAR(50),
    received_date TIMESTAMP NOT NULL,
    expected_return_date TIMESTAMP,
    warranty_months INTEGER,
    created_by UUID NOT NULL,
    assigned_to UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'RECEIVED',
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_devices_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_devices_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_created_by ON devices(created_by);
CREATE INDEX idx_devices_assigned_to ON devices(assigned_to);
CREATE INDEX idx_devices_received_date ON devices(received_date);

-- Create repair_items table
CREATE TABLE IF NOT EXISTS repair_items (
    id UUID PRIMARY KEY,
    device_id UUID NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    part_used VARCHAR(255),
    cost INTEGER NOT NULL,
    warranty_months INTEGER,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_repair_items_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_repair_items_device_id ON repair_items(device_id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    device_id UUID NOT NULL,
    total INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    final_amount INTEGER NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_transactions_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_transactions_device_id ON transactions(device_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Create warranties table
CREATE TABLE IF NOT EXISTS warranties (
    id UUID PRIMARY KEY,
    device_id UUID NOT NULL,
    repair_item_id UUID,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    warranty_code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_warranties_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    CONSTRAINT fk_warranties_repair_item FOREIGN KEY (repair_item_id) REFERENCES repair_items(id) ON DELETE SET NULL
);

CREATE INDEX idx_warranties_device_id ON warranties(device_id);
CREATE INDEX idx_warranties_warranty_code ON warranties(warranty_code);
CREATE INDEX idx_warranties_end_date ON warranties(end_date);

-- Create realtime_logs table
CREATE TABLE IF NOT EXISTS realtime_logs (
    id UUID PRIMARY KEY,
    device_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    detail TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_realtime_logs_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    CONSTRAINT fk_realtime_logs_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_realtime_logs_device_id ON realtime_logs(device_id);
CREATE INDEX idx_realtime_logs_created_by ON realtime_logs(created_by);
CREATE INDEX idx_realtime_logs_created_at ON realtime_logs(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repair_items_updated_at BEFORE UPDATE ON repair_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warranties_updated_at BEFORE UPDATE ON warranties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realtime_logs_updated_at BEFORE UPDATE ON realtime_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
