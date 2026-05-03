<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Enhanced Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="layout">
        <!-- Main Calculator Layout -->
        <div class="main">
            <div class="resultarea">
                <div id="result"></div>
            </div>
            <div class="button">
                <button onclick="appender('7')">7</button>
                <button onclick="appender('8')">8</button>
                <button onclick="appender('9')">9</button>
                <button onclick="appender('+')" style="background: #ff9f0a;">+</button>
                <button onclick="appender('4')">4</button>
                <button onclick="appender('5')">5</button>
                <button onclick="appender('6')">6</button>
                <button onclick="appender('-')" style="background: #ff9f0a;">-</button>
                <button onclick="appender('1')">1</button>
                <button onclick="appender('2')">2</button>
                <button onclick="appender('3')">3</button>
                <button onclick="appender('*')" style="background: #ff9f0a;">&#215;</button>
                <button id="clear" onclick="resclear()">C</button>
                <button onclick="appender('0')">0</button>
                <button onclick="appender('.')">.</button>
                <button onclick="appender('/')" style="background: #ff9f0a;">&divide;</button>
                <button class="span-two" onclick="calculate()" style="background: #ff9f0a;">=</button>
            </div>
        </div>

        <!-- History Display Area -->
        <div class="history-panel">
            <h2>Calculation History</h2>
            <div id="history-list">
                <?php
                if(file_exists('history.txt')) {
                    $history = file('history.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                    foreach(array_reverse($history) as $line) {
                        echo "<div class='history-item'>" . htmlspecialchars($line) . "</div>";
                    }
                }
                ?>
            </div>
            <button onclick="clearHistory()" class="clear-btn">Clear History</button>
        </div>
    </div>
    
    <script src="script.js" defer></script>
</body> 
</html>