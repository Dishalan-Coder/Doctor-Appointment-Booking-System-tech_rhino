-- Add password_hash column to doctors table
ALTER TABLE doctors ADD COLUMN password_hash VARCHAR(255) NULL AFTER email;
