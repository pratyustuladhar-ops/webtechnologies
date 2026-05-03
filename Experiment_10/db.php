<?php
// Replace these values with the database settings from your InfinityFree control panel.
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'expense_tracker';

$mysqli = new mysqli($host, $user, $password, $database);
if ($mysqli->connect_errno) {
    die('Database connection failed: ' . $mysqli->connect_error);
}
$mysqli->set_charset('utf8mb4');

function sanitize($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}
