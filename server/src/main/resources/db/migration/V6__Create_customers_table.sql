-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Create indexes for customers
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(name);

-- Add trigger for updated_at
CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing customer data from devices to customers table
-- Group by customer_name and customer_phone to avoid duplicates
INSERT INTO customers (id, name, phone, created_at, updated_at, version)
SELECT DISTINCT ON (customer_name, customer_phone)
    gen_random_uuid() as id,
    customer_name as name,
    customer_phone as phone,
    MIN(created_at) as created_at,
    MAX(updated_at) as updated_at,
    0 as version
FROM devices
WHERE customer_name IS NOT NULL AND customer_phone IS NOT NULL
GROUP BY customer_name, customer_phone
ON CONFLICT DO NOTHING;

-- Add customer_id column to devices table (nullable)
ALTER TABLE devices
    ADD COLUMN customer_id UUID NULL,
    ADD CONSTRAINT fk_devices_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Create index for customer_id
CREATE INDEX idx_devices_customer_id ON devices(customer_id);

-- Update devices to link to customers based on customer_name and customer_phone
UPDATE devices d
SET customer_id = c.id
FROM customers c
WHERE d.customer_name = c.name 
  AND d.customer_phone = c.phone
  AND d.customer_id IS NULL;

-- Make customer_name and customer_phone nullable (for backward compatibility)
-- They can still be used if customer_id is NULL
ALTER TABLE devices
    ALTER COLUMN customer_name DROP NOT NULL,
    ALTER COLUMN customer_phone DROP NOT NULL;







