-- ============================================================
-- Smart Cafe: Brew & Ritual — Full Schema
-- ============================================================
DROP DATABASE IF EXISTS smart_cafe;
CREATE DATABASE smart_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_cafe;

-- Menu Items
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE
);

-- Users (Customers & Waiters)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'waiter') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    customer_name VARCHAR(100) DEFAULT 'Guest',
    table_number INT NOT NULL,
    status ENUM('Pending', 'Preparing', 'Ready', 'Served') DEFAULT 'Pending',
    total_price DECIMAL(10, 2) NOT NULL,
    estimated_wait_minutes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu(id)
);

-- ============================================================
-- Seed: Menu Items
-- ============================================================
INSERT INTO menu (name, description, category, price, image_url) VALUES
('Double Espresso', 'A concentrated shot of our seasonal dark roast, featuring notes of dark chocolate and dried fruit.', 'Espresso', 4.50, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop'),
('Velvet Latte', 'Perfectly steamed microfoam poured over a double ristretto shot. Smooth, creamy, and beautifully balanced.', 'Espresso', 5.50, 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?q=80&w=600&auto=format&fit=crop'),
('Chemex Pour Over', 'A clean, bright cup emphasizing the floral and fruity notes of our Ethiopian Yirgacheffe beans.', 'Pour Over', 6.00, 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=600&auto=format&fit=crop'),
('Nitro Cold Brew', 'Steeped for 24 hours and infused with nitrogen for a creamy, stout-like texture without the dairy.', 'Cold Brew', 5.75, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop'),
('Dark Cocoa Croissant', 'Flaky, buttery pastry wrapped around a core of bittersweet Belgian chocolate. Baked fresh daily.', 'Pastries', 4.00, 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?q=80&w=600&auto=format&fit=crop'),
('Matcha Zen Bowl', 'Ceremonial grade matcha blended with oat milk, topped with crushed pistachios and honey drizzle.', 'Specials', 6.50, 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?q=80&w=600&auto=format&fit=crop'),
('Classic Cappuccino', 'Equal parts espresso, steamed milk, and velvety microfoam. An Italian staple, perfected.', 'Espresso', 5.00, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop'),
('Avocado Toast', 'Sourdough toast topped with smashed avocado, sea salt, chili flakes, and a poached egg.', 'Food', 8.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop');

-- ============================================================
-- Seed: Default Users
-- password_hash is for 'password123' using PASSWORD_DEFAULT
-- ============================================================
INSERT INTO users (username, email, password_hash, role) VALUES
('waiter1', 'waiter@brewritual.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'waiter'),
('demo_customer', 'demo@brewritual.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');
