<?php
// Quick test to verify database connection and registration
require 'api/db.php';
header('Content-Type: application/json');

echo "=== Smart Cafe Database Test ===\n\n";

try {
    // Test connection
    echo "✓ Database connection successful\n";
    
    // Check tables
    $tables = ['users', 'menu', 'orders', 'order_items'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
        $count = $stmt->fetchColumn();
        echo "✓ Table '$table': $count rows\n";
    }
    
    echo "\n=== Sample Data ===\n";
    
    // Show sample users
    $stmt = $pdo->query("SELECT id, username, email, role FROM users LIMIT 5");
    echo "\nUsers:\n";
    while ($row = $stmt->fetch()) {
        echo "  - {$row['username']} ({$row['role']})\n";
    }
    
    // Show menu items
    $stmt = $pdo->query("SELECT COUNT(*) FROM menu");
    $menuCount = $stmt->fetchColumn();
    echo "\nMenu items: $menuCount\n";
    
} catch (Exception $e) {
    echo "✗ Error: {$e->getMessage()}\n";
}
?>
