<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['table_number']) || empty($input['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid order data']);
    exit;
}

$tableNumber = (int)$input['table_number'];
$items = $input['items'];

$customerId = null;
$customerName = 'Guest';
if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'customer') {
    $customerId = $_SESSION['user_id'];
    $customerName = $_SESSION['username'];
}

try {
    $pdo->beginTransaction();

    $totalPrice = 0;
    foreach ($items as &$item) {
        $stmt = $pdo->prepare("SELECT price FROM menu WHERE id = ?");
        $stmt->execute([$item['id']]);
        $menuItem = $stmt->fetch();
        if (!$menuItem) {
            throw new Exception("Invalid item ID: " . $item['id']);
        }
        $item['price_at_time'] = $menuItem['price'];
        $totalPrice += ($menuItem['price'] * $item['quantity']);
    }
    unset($item);

    // Determine estimated wait time: Base 5 mins, +3 mins per active order
    $activeStmt = $pdo->query("SELECT COUNT(*) FROM orders WHERE status IN ('Pending', 'Preparing')");
    $activeOrders = $activeStmt->fetchColumn();
    $estimatedWait = 5 + ($activeOrders * 3);

    $insertOrder = $pdo->prepare("INSERT INTO orders (customer_id, customer_name, table_number, total_price, estimated_wait_minutes) VALUES (?, ?, ?, ?, ?)");
    $insertOrder->execute([$customerId, $customerName, $tableNumber, $totalPrice, $estimatedWait]);
    $orderId = $pdo->lastInsertId();

    $insertItem = $pdo->prepare("INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)");
    foreach ($items as $item) {
        $insertItem->execute([$orderId, $item['id'], $item['quantity'], $item['price_at_time']]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'order_id' => $orderId,
        'estimated_wait_minutes' => $estimatedWait
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
