-- Create service_catalog table
CREATE TABLE service_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    default_part_used VARCHAR(255),
    base_cost INTEGER NOT NULL DEFAULT 0,
    default_warranty_months INTEGER,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Add trigger for updated_at
CREATE TRIGGER trg_service_catalog_updated_at
BEFORE UPDATE ON service_catalog
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Seed common services
INSERT INTO service_catalog (name, default_part_used, base_cost, default_warranty_months, description) VALUES
('Screen Replacement', 'OLED/AMOLED panel', 1500000, 3, 'Thay màn hình, đã gồm công'),
('Battery Replacement', 'OEM/Original battery', 450000, 3, 'Thay pin, cân chỉnh hiệu năng'),
('Charging Port Repair', 'Charging flex', 350000, 1, 'Sửa/thay cổng sạc'),
('Camera Module Replacement', 'Rear camera module', 900000, 3, 'Thay camera sau'),
('Front Camera Replacement', 'Front camera module', 500000, 3, 'Thay camera trước'),
('Speaker / Mic Repair', 'Speaker/Mic unit', 250000, 1, 'Sửa loa/mic'),
('Back Glass Replacement', 'Back glass', 800000, 3, 'Thay nắp lưng kính'),
('Mainboard Repair', 'Rework board', 1800000, 1, 'Sửa/chạy lại mainboard'),
('Software Fix', NULL, 200000, 0, 'Cài lại/đặt lại phần mềm'),
('Water Damage Cleaning', 'Cleaning materials', 400000, 0, 'Vệ sinh máy vào nước');

-- Alter repair_items to add service_id FK
ALTER TABLE repair_items
    ADD COLUMN service_id UUID NULL,
    ADD CONSTRAINT fk_repair_items_service_catalog FOREIGN KEY (service_id) REFERENCES service_catalog(id);

CREATE INDEX idx_repair_items_service_id ON repair_items(service_id);



