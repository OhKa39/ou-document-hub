-- Add 'is_delete' column to 'documents' table
ALTER TABLE comments
ADD COLUMN is_delete BOOLEAN DEFAULT FALSE NOT NULL;

