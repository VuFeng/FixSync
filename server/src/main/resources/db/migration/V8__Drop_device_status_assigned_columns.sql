-- Drop legacy status/assignment/time columns from devices
ALTER TABLE devices
    DROP COLUMN IF EXISTS status,
    DROP COLUMN IF EXISTS assigned_to,
    DROP COLUMN IF EXISTS received_date,
    DROP COLUMN IF EXISTS expected_return_date,
    DROP COLUMN IF EXISTS warranty_months;

-- Drop legacy indexes if exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_devices_status') THEN
        DROP INDEX idx_devices_status;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_devices_assigned_to') THEN
        DROP INDEX idx_devices_assigned_to;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_devices_received_date') THEN
        DROP INDEX idx_devices_received_date;
    END IF;
END $$;







