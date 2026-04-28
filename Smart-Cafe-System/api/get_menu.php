<?php
require 'db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM menu WHERE is_available = TRUE");
    $menu = $stmt->fetchAll();
    echo json_encode($menu);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch menu']);
}
?>
