<?php
header('Content-Type: application/json');

// Safe math evaluation without using eval()
function safeEvaluate($expr) {
    // Resolve basic operators following PEDMAS/BODMAS
    // First mult/div
    while (preg_match('/(\-?\d+\.?\d*)([\*\/])(\-?\d+\.?\d*)/', $expr, $matches)) {
        $a = (float)$matches[1];
        $b = (float)$matches[3];
        if ($matches[2] == '*') {
            $res = $a * $b;
        } else {
            if ($b == 0) throw new Exception("Division by zero");
            $res = $a / $b;
        }
        $expr = preg_replace('/' . preg_quote($matches[0], '/') . '/', $res, $expr, 1);
    }
    
    // Normalize signs
    $expr = str_replace(['++', '+-', '-+', '--'], ['+', '-', '-', '+'], $expr);
    
    // Then add/sub
    while (preg_match('/(\-?\d+\.?\d*)([\+\-])(\d+\.?\d*)/', $expr, $matches)) {
        $a = (float)$matches[1];
        $b = (float)$matches[3];
        if ($matches[2] == '+') {
            $res = $a + $b;
        } else {
            $res = $a - $b;
        }
        $expr = preg_replace('/' . preg_quote($matches[0], '/') . '/', $res, $expr, 1);
    }
    
    return $expr;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'] ?? '';

    if ($action === 'clear_history') {
        @file_put_contents('history.txt', '');
        echo json_encode(["status" => "success"]);
        exit;
    }

    if ($action === 'calculate') {
        $expr = $_POST['expression'] ?? '';
        $safe_expr = preg_replace('/[^0-9\+\-\*\/\.]/', '', $expr);

        if (empty($safe_expr)) {
            echo json_encode(["status" => "error", "message" => "Invalid expression"]);
            exit;
        }

        try {
            if (preg_match('/\/0(\.0+)?(?![\.0-9])/', $safe_expr)) {
                throw new Exception("Division by zero");
            }

            $result = safeEvaluate($safe_expr);

            if (!is_numeric($result)) {
                echo json_encode(["status" => "error", "message" => "Evaluation error"]);
            } else {
                $historyEntry = $safe_expr . " = " . $result;
                @file_put_contents('history.txt', $historyEntry . PHP_EOL, FILE_APPEND | LOCK_EX);
                echo json_encode(["status" => "success", "result" => (float)$result, "history" => $historyEntry]);
            }
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        } catch (Error $e) {
            echo json_encode(["status" => "error", "message" => "Math Error"]);
        }
        exit;
    }
}

echo json_encode(["status" => "error", "message" => "Invalid request"]);
?>