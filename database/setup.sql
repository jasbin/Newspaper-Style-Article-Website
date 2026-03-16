-- ============================================================
-- The Daily Chronicle - Database Setup
-- Run this script in MySQL before starting the backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS newspaper_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE newspaper_db;

-- Tables are auto-created by Spring Boot JPA (ddl-auto=update)
-- This script just creates the database and a dedicated user

-- Create a dedicated DB user (recommended over using root)
CREATE USER IF NOT EXISTS 'newspaper_user'@'localhost' IDENTIFIED BY 'newspaper_pass123';
GRANT ALL PRIVILEGES ON newspaper_db.* TO 'newspaper_user'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Database setup complete!' AS status;
