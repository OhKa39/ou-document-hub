CREATE TABLE if NOT exists "oauth2_authorized_client" (
    "client_registration_id" varchar(100) NOT NULL,
    "principal_name" varchar(200) NOT NULL,
    "access_token_type" varchar(100) NOT NULL,
    "access_token_value" text NOT NULL,
    "access_token_issued_at" timestamp without time zone NOT NULL,
    "access_token_expires_at" timestamp without time zone NOT NULL,
    "access_token_scopes" varchar(1000) DEFAULT NULL::character varying,
    "refresh_token_value" text,
    "refresh_token_issued_at" timestamp without time zone,
    "created_at" timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (
        "client_registration_id",
        "principal_name"
    )
);

CREATE TABLE IF NOT EXISTS "users" (
    "user_id" uuid PRIMARY KEY,
    "email" varchar(255) NOT NULL,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp,
    "last_name" varchar(40),
    "first_name" varchar(40),
    "password" varchar(255),
    "gender" varchar(10),
    "avatar_link" varchar(255),
    "is_banned" bool DEFAULT false,
    "is_enable" bool DEFAULT false,
    "date_of_birth" date,
    "provider" varchar(20)
);

CREATE TABLE if NOT EXISTS "seller_information" (
    "user_id" uuid PRIMARY KEY,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp,
    "merchant_id" varchar(100),
    "is_verified" boolean DEFAULT (false),
    "account_type" VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS "cards" (
    "card_id" uuid PRIMARY KEY,
    "card_number" varchar(255),
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp,
    "token" varchar(255),
    "created_by" uuid
);

CREATE TABLE IF NOT EXISTS "roles" (
    "role_id" uuid PRIMARY KEY,
    "role_name" varchar(20)
);

CREATE TABLE IF NOT EXISTS "user_role" (
    "user_id" uuid,
    "role_id" uuid,
    PRIMARY KEY ("user_id", "role_id")
);

CREATE TABLE IF NOT EXISTS "documents" (
    "document_id" uuid PRIMARY KEY,
    "document_type" varchar(20),
    "created_by" uuid,
    "document_name" varchar(255),
    "status" varchar(20),
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp,
    "description" varchar(255),
    "short_url" varchar(255),
    "tag" varchar(10),
    "price" NUMERIC,
    "thumbnail_url" varchar(255),
    "faculty_id" uuid
);

CREATE TABLE IF NOT EXISTS "comments" (
    "comment_id" uuid PRIMARY KEY,
    "parent_id" uuid,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp,
    "is_edit" boolean DEFAULT false,
    "detail" varchar(255),
    "document_id" uuid,
    "created_by" uuid
);

CREATE TABLE IF NOT EXISTS "document_images" (
    "image_id" uuid PRIMARY KEY,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp,
    "document_id" uuid,
    "image_link" varchar(255)
);

CREATE TABLE IF NOT EXISTS "online_documents" (
    "document_id" uuid PRIMARY KEY,
    "document_type" varchar(20) DEFAULT 'Online',
    "file_type" varchar(30),
    "file_url" varchar(255)
);

CREATE TABLE IF NOT EXISTS "paper_documents" (
    "document_type" varchar(20) DEFAULT 'Paper',
    "document_id" uuid primary key,
    "stock" int
);

CREATE TABLE "paperdocument_shipaddress" (
    "document_id" uuid,
    "address_id" uuid,
    PRIMARY KEY ("document_id", "address_id")
);

CREATE TABLE IF NOT EXISTS "ship_addresses" (
    "address_id" uuid PRIMARY KEY,
    "address_name" varchar(255)
);

CREATE TABLE IF NOT EXISTS "faculties" (
    "faculty_id" uuid PRIMARY KEY,
    "faculty_name" varchar(100)
);

CREATE TABLE IF NOT EXISTS "order_items" (
    "document_id" uuid PRIMARY KEY,
    "quantity" int,
    "price" money,
    "status" varchar(50),
    "order_id" uuid
);

CREATE TABLE IF NOT EXISTS "cart_items" (
    "item_id" uuid PRIMARY KEY,
    "document_id" uuid,
    "quantity" int,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp,
    "price" money,
    "cart_id" uuid
);

CREATE TABLE IF NOT EXISTS "cart" (
    "cart_id" uuid UNIQUE,
    "user_id" uuid PRIMARY KEY,
    "created_at" timestamp DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS "orders" (
    "order_id" uuid PRIMARY KEY,
    "created_at" timestamp DEFAULT (now()),
    "created_by" uuid
);

CREATE UNIQUE INDEX ON "roles" ("role_name");

CREATE UNIQUE INDEX ON "faculties" ("faculty_name");

CREATE UNIQUE INDEX ON "ship_addresses" ("address_name");

CREATE UNIQUE INDEX short_url_1729266864455_index ON "documents" USING btree ("short_url");

ALTER TABLE "seller_information"
ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "cards"
ADD FOREIGN KEY ("created_by") REFERENCES "users" ("user_id");

ALTER TABLE "user_role"
ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "user_role"
ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("role_id");

ALTER TABLE "documents"
ADD FOREIGN KEY ("created_by") REFERENCES "users" ("user_id");

ALTER TABLE "documents"
ADD FOREIGN KEY ("faculty_id") REFERENCES "faculties" ("faculty_id");

ALTER TABLE "comments"
ADD FOREIGN KEY ("parent_id") REFERENCES "comments" ("comment_id");

ALTER TABLE "comments"
ADD FOREIGN KEY ("document_id") REFERENCES "documents" ("document_id");

ALTER TABLE "comments"
ADD FOREIGN KEY ("created_by") REFERENCES "users" ("user_id");

ALTER TABLE "document_images"
ADD FOREIGN KEY ("document_id") REFERENCES "documents" ("document_id");

ALTER TABLE "online_documents"
ADD FOREIGN KEY ("document_id") REFERENCES "documents" ("document_id");

ALTER TABLE "paper_documents"
ADD FOREIGN KEY ("document_id") REFERENCES "documents" ("document_id");

ALTER TABLE "paperdocument_shipaddress"
ADD FOREIGN KEY ("document_id") REFERENCES "paper_documents" ("document_id");

ALTER TABLE "paperdocument_shipaddress"
ADD FOREIGN KEY ("address_id") REFERENCES "ship_addresses" ("address_id");

ALTER TABLE "order_items"
ADD FOREIGN KEY ("document_id") REFERENCES "documents" ("document_id");

ALTER TABLE "order_items"
ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id");

ALTER TABLE "cart_items"
ADD FOREIGN KEY ("document_id") REFERENCES "documents" ("document_id");

ALTER TABLE "cart_items"
ADD FOREIGN KEY ("cart_id") REFERENCES "cart" ("user_id");

ALTER TABLE "cart"
ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "orders"
ADD FOREIGN KEY ("created_by") REFERENCES "users" ("user_id");