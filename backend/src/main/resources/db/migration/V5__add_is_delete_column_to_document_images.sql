
-- Add 'is_delete' column to 'document_images' table
ALTER TABLE document_images
ADD COLUMN is_delete BOOLEAN DEFAULT FALSE NOT NULL;
