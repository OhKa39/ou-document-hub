-- Add is_online column to users table
ALTER TABLE users
ADD COLUMN is_online BOOLEAN NOT NULL DEFAULT FALSE;

-- Add is_read column to messages table
ALTER TABLE messages
ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT FALSE;
