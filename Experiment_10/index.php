<?php
// Classic MySQL Database Configuration (Default XAMPP)
// $servername = "localhost";
// $username = "root";
// $password = "";
// $dbname = "portfolio_db";

// 1. Create connection to MySQL
$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . ". Make sure XAMPP MySQL is running!");
}

// 2. Auto-create database & table if they don't exist
$conn->query("CREATE DATABASE IF NOT EXISTS $dbname");
$conn->select_db($dbname);

$tableSql = "CREATE TABLE IF NOT EXISTS guestbook (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($tableSql);

// Handle standard form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['guest_name'] ?? '');
    $message = trim($_POST['guest_message'] ?? '');
    
    if (!empty($name) && !empty($message)) {
        // Use prepared statements to securely write to database and prevent SQL Injection
        $stmt = $conn->prepare("INSERT INTO guestbook (name, message) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $message);
        $stmt->execute();
        $stmt->close();
        
        // Redirect back to avoid form resubmission on refresh
        header("Location: index.php");
        exit;
    }
}

// Read old entries directly from MySQL
$entries = "";
$sql = "SELECT name, message, created_at FROM guestbook ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Sanitize on output to prevent XSS
        $safe_name = htmlspecialchars($row["name"]);
        $safe_date = htmlspecialchars($row["created_at"]);
        $safe_message = htmlspecialchars(nl2br($row["message"])); // Preserves line breaks safely
        
        $entries .= "<p><strong>$safe_name</strong> <small>($safe_date)</small> wrote: <br> $safe_message </p><hr>\n";
    }
} else {
    $entries = "<p>No messages yet. Be the first to sign the database!</p>";
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Classic PHP Guestbook</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="container">
        <h1>Welcome to My Website</h1>
        <p class="subtitle">Please leave a message in the Guestbook before you leave!</p>

        <div id="guestbook-entries">
            <?php echo $entries; ?>
        </div>

        <div id="form-container">
            <h2>Sign the Guestbook</h2>
            <form action="index.php" method="POST" id="guestbookForm">
                <label for="guest_name">Your Name:</label>
                <input type="text" id="guest_name" name="guest_name" required>
                
                <label for="guest_message">Your Message:</label>
                <textarea id="guest_message" name="guest_message" rows="4" required></textarea>
                
                <button type="submit" id="submitBtn">Sign Guestbook</button>
            </form>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>