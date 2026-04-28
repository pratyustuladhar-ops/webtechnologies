CREATE DATABASE IF NOT EXISTS smart_cafe;
USE smart_cafe;

CREATE TABLE IF NOT EXISTS menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL,
    status ENUM('Pending', 'Preparing', 'Ready', 'Served') DEFAULT 'Pending',
    total_price DECIMAL(10, 2) NOT NULL,
    estimated_wait_minutes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu(id)
);

-- Insert dummy data if table is empty
INSERT INTO menu (name, description, category, price, image_url)
SELECT * FROM (
    SELECT 'Double Espresso', 'A concentrated shot of our seasonal dark roast, featuring notes of dark chocolate.', 'Espresso', 4.50, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop' UNION ALL
    SELECT 'Velvet Latte', 'Perfectly steamed microfoam poured over a double ristretto shot. Smooth and creamy.', 'Espresso', 5.50, 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?q=80&w=600&auto=format&fit=crop' UNION ALL
    SELECT 'Chemex Pour Over', 'A clean, bright cup emphasizing the floral and fruity notes of our Ethiopian Yirgacheffe beans.', 'Pour Over', 6.00, 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=600&auto=format&fit=crop' UNION ALL
    SELECT 'Nitro Cold Brew', 'Steeped for 24 hours and infused with nitrogen for a creamy, stout-like texture without the dairy.', 'Cold Brew', 5.75, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop' UNION ALL
    SELECT 'Dark Cocoa Croissant', 'Flaky, buttery pastry wrapped around a core of bittersweet Belgian chocolate. Baked fresh daily.', 'Pastries', 4.00, 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?q=80&w=600&auto=format&fit=crop'
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM menu WHERE name = 'Double Espresso'
);
