let operation = "";

function appender(value) {
    if (operation === "0" && value !== ".") {
        operation = value;
    } else {
        operation += value;
    }
    display();
}

function display() {
    document.getElementById('result').innerText = operation || '0';
}

function clearAll() {
    operation = "";
    display();
}

function clearEntry() {
    operation = operation.slice(0, -1);
    display();
}

async function calculate() {
    if (!operation) return;

    const resultElement = document.getElementById('result');
    resultElement.innerText = "...";

    try {
        let formData = new FormData();
        formData.append('expression', operation);
        formData.append('action', 'calculate');

        let response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });

        let responseText = await response.text();
        console.log("Raw Server Response:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Standard JSON parse failed, attempting extraction...");
            let match = responseText.match(/\{.*\}/s);
            if (match) {
                data = JSON.parse(match[0]);
            } else {
                throw new Error("Invalid response format from server: " + responseText);
            }
        }

        if (data.status === 'success') {
            resultElement.innerText = data.result;
            operation = data.result.toString();
            updateHistory(data.history);
        } else {
            console.error("Server returned error:", data.message);
            resultElement.innerText = "Error";
            operation = "";
        }
    } catch (e) {
        console.error("Network or Parsing Error:", e);
        if (window.location.protocol === 'file:') {
            resultElement.innerText = "Local File Error";
        } else {
            resultElement.innerText = "Error";
        }
        operation = "";
    }
}

async function clearHistory() {
    let formData = new FormData();
    formData.append('action', 'clear_history');

    await fetch('api.php', {
        method: 'POST',
        body: formData
    });

    let historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.innerHTML = "";
    }
}

function updateHistory(historyString) {
    let historyList = document.getElementById('history-list');
    if (!historyList) return;

    let newEntryHTML = `<div class='history-item'>${historyString}</div>`;
    historyList.innerHTML = newEntryHTML + historyList.innerHTML;
}