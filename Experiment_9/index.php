<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Enhanced Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator-layout">
        <div class="calculator-shell">
            <div class="calculator-card">
                <div class="display" id="result">0</div>
                <div class="buttons">
                    <button class="btn function" onclick="clearAll()">AC</button>
                    <button class="btn function" onclick="clearEntry()">C</button>
                    <button class="btn function" onclick="appender('%')">%</button>
                    <button class="btn operator" onclick="appender('/')">÷</button>

                    <button class="btn number" onclick="appender('7')">7</button>
                    <button class="btn number" onclick="appender('8')">8</button>
                    <button class="btn number" onclick="appender('9')">9</button>
                    <button class="btn operator" onclick="appender('*')">×</button>

                    <button class="btn number" onclick="appender('4')">4</button>
                    <button class="btn number" onclick="appender('5')">5</button>
                    <button class="btn number" onclick="appender('6')">6</button>
                    <button class="btn operator" onclick="appender('-')">−</button>

                    <button class="btn number" onclick="appender('1')">1</button>
                    <button class="btn number" onclick="appender('2')">2</button>
                    <button class="btn number" onclick="appender('3')">3</button>
                    <button class="btn operator" onclick="appender('+')">+</button>

                    <button class="btn number double" onclick="appender('00')">00</button>
                    <button class="btn number" onclick="appender('0')">0</button>
                    <button class="btn number" onclick="appender('.')">.</button>
                    <button class="btn equals" onclick="calculate()">=</button>
                </div>
            </div>
        </div>

        <div class="history-card">
            <div class="history-header">
                <h2>Calculation History</h2>
                <button class="history-clear" onclick="clearHistory()">Clear</button>
            </div>
            <div id="history-list">
                <?php
                if (file_exists('history.txt')) {
                    $history = file('history.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    foreach (array_reverse($history) as $line) {
                        echo "<div class='history-item'>" . htmlspecialchars($line) . "</div>";
                    }
                }
                ?>
            </div>
        </div>
    </div>

    <script src="script.js" defer></script>
</body> 
</html>