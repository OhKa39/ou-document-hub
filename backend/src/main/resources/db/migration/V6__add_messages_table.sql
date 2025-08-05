-- PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chat Rooms Table
CREATE TABLE chat_rooms (
    room_id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);

-- Messages Table
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_edit BOOLEAN NOT NULL DEFAULT FALSE,
    is_delete BOOLEAN NOT NULL DEFAULT FALSE,
    sender UUID NOT NULL,
    room_id UUID NOT NULL,
    reply_id UUID,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (reply_id) REFERENCES messages(message_id) ON DELETE SET NULL
);

-- Chat Rooms Users Junction Table
CREATE TABLE chat_rooms_users (
    room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    last_message_read UUID,
    PRIMARY KEY (room_id, user_id),
    FOREIGN KEY (room_id) REFERENCES chat_rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (last_message_read) REFERENCES messages(message_id) ON DELETE SET NULL
);

