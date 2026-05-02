<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    echo json_encode([
        'authenticated' => true,
        'user_id' => $_SESSION['user_id'],
        'role' => $_SESSION['role'],
        'username' => $_SESSION['username']
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
}
?>
