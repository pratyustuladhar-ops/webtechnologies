<?php
require 'db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT o.id, o.table_number, o.status, o.created_at, o.estimated_wait_minutes, o.customer_name,
               m.name, oi.quantity
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu m ON oi.menu_item_id = m.id
        WHERE o.status != 'Served'
        ORDER BY o.created_at ASC
    ");
    
    $rows = $stmt->fetchAll();
    $orders = [];
    
    foreach ($rows as $row) {
        $orderId = $row['id'];
        if (!isset($orders[$orderId])) {
            $orders[$orderId] = [
                'id' => $row['id'],
                'table_number' => $row['table_number'],
                'status' => $row['status'],
                'created_at' => $row['created_at'],
                'estimated_wait_minutes' => $row['estimated_wait_minutes'],
                'customer_name' => $row['customer_name'] || 'Guest',
                'items' => []
            ];
        }
        if ($row['name']) {
            $orders[$orderId]['items'][] = [
                'name' => $row['name'],
                'quantity' => $row['quantity']
            ];
        }
    }
    
    echo json_encode(array_values($orders));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch orders', 'details' => $e->getMessage()]);
}
?>
