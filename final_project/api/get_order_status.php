<?php
require 'db.php';
header('Content-Type: application/json');

$orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$orderId) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID is required']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT o.id, o.table_number, o.status, o.total_price, o.estimated_wait_minutes, o.created_at,
               m.name, oi.quantity, oi.price_at_time as price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN menu m ON oi.menu_item_id = m.id
        WHERE o.id = ?
    ");
    $stmt->execute([$orderId]);
    $rows = $stmt->fetchAll();

    if (count($rows) > 0) {
        $order = [
            'id' => $rows[0]['id'],
            'table_number' => $rows[0]['table_number'],
            'status' => $rows[0]['status'],
            'total_price' => $rows[0]['total_price'],
            'estimated_wait_minutes' => $rows[0]['estimated_wait_minutes'],
            'created_at' => $rows[0]['created_at'],
            'items' => []
        ];
        
        foreach ($rows as $row) {
            if ($row['name']) {
                $order['items'][] = [
                    'name' => $row['name'],
                    'quantity' => $row['quantity'],
                    'price' => $row['price']
                ];
            }
        }
        
        echo json_encode($order);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Order not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch status']);
}
?>
