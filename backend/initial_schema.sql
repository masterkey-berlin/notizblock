CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Seeding the database with initial data
INSERT INTO notes (name, description, is_completed) VALUES ('Note 1', 'Description for note 1', FALSE);
