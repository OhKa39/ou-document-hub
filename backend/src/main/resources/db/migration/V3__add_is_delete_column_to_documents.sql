-- Add 'is_delete' column to 'documents' table
ALTER TABLE documents
ADD COLUMN is_delete BOOLEAN DEFAULT FALSE NOT NULL;

