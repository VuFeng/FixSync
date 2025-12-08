-- Create media table for file storage
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- IMAGE, DOCUMENT, VIDEO, etc.
    entity_type VARCHAR(50), -- DEVICE, USER, BRAND, REPAIR_ITEM, etc.
    entity_id UUID, -- ID của entity liên quan (device_id, user_id, etc.)
    uploaded_by UUID NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_media_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_media_entity_type_id ON media(entity_type, entity_id);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_media_type ON media(media_type);
CREATE INDEX idx_media_is_active ON media(is_active);
CREATE INDEX idx_media_created_at ON media(created_at);

-- Add trigger for updated_at column
CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


