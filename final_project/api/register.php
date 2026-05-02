<?php
require 'db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['full_name']) || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Full name, email, and password are required']);
    exit;
}

// Validate role
$validRoles = ['customer', 'waiter'];
$role = isset($input['role']) && in_array($input['role'], $validRoles) ? $input['role'] : 'customer';

try {
    // Check if user exists by email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$input['email']]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Email already registered']);
        exit;
    }

    // Check if username exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$input['full_name']]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Username already taken']);
        exit;
    }

    $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);

    $insert = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
    $insert->execute([$input['full_name'], $input['email'], $passwordHash, $role]);

    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'role' => $role
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An error occurred during registration.', 'details' => $e->getMessage()]);
}
?>
