<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

// Accept either 'identifier', 'email', or 'username' as the login identifier
if ((!isset($input['identifier']) && !isset($input['email']) && !isset($input['username'])) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Identifier, email, or username and password are required']);
    exit;
}

// Determine which field to use for lookup
if (isset($input['identifier'])) {
    $identifier = $input['identifier'];
} elseif (isset($input['email'])) {
    $identifier = $input['email'];
} else {
    $identifier = $input['username'];
}

try {
    $stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();

    if ($user && password_verify($input['password'], $user['password_hash'])) {
        // Successful login – set session values
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['username'] = $user['username'];
        echo json_encode([
            'success' => true,
            'role' => $user['role'],
            'message' => 'Login successful'
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An error occurred during login']);
}
?>
