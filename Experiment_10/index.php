<?php
require_once __DIR__ . '/db.php';

$message = '';
$editExpense = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitize($_POST['title'] ?? '');
    $amount = sanitize($_POST['amount'] ?? '');
    $date = sanitize($_POST['date'] ?? '');
    $expenseId = isset($_POST['expense_id']) ? intval($_POST['expense_id']) : null;

    if ($title === '' || $amount === '' || $date === '') {
        $message = 'Please complete all fields before submitting.';
    } elseif (!is_numeric($amount) || floatval($amount) <= 0) {
        $message = 'Amount must be a positive number.';
    } else {
        if ($expenseId) {
            $stmt = $mysqli->prepare('UPDATE expenses SET title = ?, amount = ?, date = ? WHERE id = ?');
            $stmt->bind_param('sdsi', $title, $amount, $date, $expenseId);
            $stmt->execute();
            $stmt->close();
            header('Location: index.php?updated=1');
            exit;
        } else {
            $stmt = $mysqli->prepare('INSERT INTO expenses (title, amount, date, created_at) VALUES (?, ?, ?, NOW())');
            $stmt->bind_param('sds', $title, $amount, $date);
            $stmt->execute();
            $stmt->close();
            header('Location: index.php?added=1');
            exit;
        }
    }
}

if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $mysqli->prepare('DELETE FROM expenses WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();
    header('Location: index.php?deleted=1');
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'edit' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $mysqli->prepare('SELECT id, title, amount, date FROM expenses WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $editExpense = $result->fetch_assoc();
    $stmt->close();
}

$expenses = [];
$result = $mysqli->query('SELECT id, title, amount, date, created_at FROM expenses ORDER BY date DESC, created_at DESC');
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $expenses[] = $row;
    }
    $result->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Expense Tracker</h1>
            <p>Track your spending with a simple PHP & MySQL app.</p>
        </header>

        <?php if (isset($_GET['added'])): ?>
            <div class="alert success">Expense added successfully.</div>
        <?php elseif (isset($_GET['updated'])): ?>
            <div class="alert success">Expense updated successfully.</div>
        <?php elseif (isset($_GET['deleted'])): ?>
            <div class="alert success">Expense deleted successfully.</div>
        <?php endif; ?>

        <?php if ($message): ?>
            <div class="alert error"><?php echo $message; ?></div>
        <?php endif; ?>

        <section class="form-card">
            <h2><?php echo $editExpense ? 'Edit Expense' : 'Add New Expense'; ?></h2>
            <form id="expense-form" method="post" action="index.php">
                <?php if ($editExpense): ?>
                    <input type="hidden" name="expense_id" value="<?php echo $editExpense['id']; ?>">
                <?php endif; ?>

                <label for="title">Title</label>
                <input id="title" name="title" type="text" value="<?php echo $editExpense ? htmlspecialchars($editExpense['title'], ENT_QUOTES, 'UTF-8') : ''; ?>" required>

                <label for="amount">Amount</label>
                <input id="amount" name="amount" type="number" step="0.01" min="0.01" value="<?php echo $editExpense ? htmlspecialchars($editExpense['amount'], ENT_QUOTES, 'UTF-8') : ''; ?>" required>

                <label for="date">Date</label>
                <input id="date" name="date" type="date" value="<?php echo $editExpense ? htmlspecialchars($editExpense['date'], ENT_QUOTES, 'UTF-8') : ''; ?>" required>

                <button type="submit"><?php echo $editExpense ? 'Update Expense' : 'Save Expense'; ?></button>
                <?php if ($editExpense): ?>
                    <a class="button cancel" href="index.php">Cancel</a>
                <?php endif; ?>
            </form>
        </section>

        <section class="table-card">
            <h2>Expense History</h2>
            <?php if (count($expenses) === 0): ?>
                <p class="empty-state">No expenses recorded yet.</p>
            <?php else: ?>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Added</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($expenses as $expense): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($expense['title'], ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo number_format($expense['amount'], 2); ?></td>
                                    <td><?php echo htmlspecialchars($expense['date'], ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo date('M j, Y H:i', strtotime($expense['created_at'])); ?></td>
                                    <td>
                                        <a class="action edit" href="index.php?action=edit&id=<?php echo $expense['id']; ?>">Edit</a>
                                        <a class="action delete" href="index.php?action=delete&id=<?php echo $expense['id']; ?>" onclick="return confirmDelete();">Delete</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </section>
    </div>

    <script src="script.js"></script>
</body>
</html>
