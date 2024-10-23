-- Create the combined database
CREATE DATABASE IF NOT EXISTS store;
USE store;

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_admin_only BOOLEAN DEFAULT FALSE
);

-- Insert products into the products table
INSERT INTO products (name, description, price, is_admin_only) VALUES
('Product 1', 'ps4 controller', 19.99, FALSE),
('Product 2', 'beats headphones', 29.99, FALSE),
('Product 3', 'Pc monitor', 15.99, FALSE),
('Product 4', 'Apple Watch', 9.99, FALSE),
('Product 5', 'Keyboard', 12.99, FALSE),
('Admin Product 1', 'Airpods', 49.99, TRUE),
('Admin Product 2', 'IPhone 16', 59.99, TRUE);

-- Create the user_accounts table
CREATE TABLE IF NOT EXISTS user_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Insert users into the user_accounts table
INSERT INTO user_accounts (username, password, is_admin) VALUES
('pero', 'pero123', FALSE),
('ivana', 'ivana123', FALSE),
('kristina', 'kristina123', FALSE),
('mario', 'mario123', FALSE), 
('karlo', 'karlo123', FALSE),
('marko', 'marko123', FALSE), 
('marija', 'marija123', FALSE),
('ana', 'ana123', FALSE),
('josip', 'josip123', FALSE),
('admin', 'admin123', TRUE);
