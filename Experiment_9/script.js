let operation = "";

function appender(numoper) {
    operation += numoper;
    display();
}

function display() {
    document.getElementById('result').innerHTML = operation;
}

function resclear() {
    operation = "";
    document.getElementById('result').innerHTML = "";
}

async function calculate() {
    if (!operation) return;
    
    // Check for valid current operation visually before sending.
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = "..."; 
    
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
            // First try normal parse
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Standard JSON parse failed, attempting extraction...");
            // Free hosts often inject HTML. Try to extract just the JSON part
            let match = responseText.match(/\{.*\}/s);
            if (match) {
                data = JSON.parse(match[0]);
            } else {
                throw new Error("Invalid response format from server: " + responseText);
            }
        }
        
        if (data.status === 'success') {
            resultElement.innerHTML = data.result;
            operation = data.result.toString();
            updateHistory(data.history);
        } else {
            console.error("Server returned error:", data.message);
            resultElement.innerHTML = "Error: " + data.message;
            operation = "";
        }
    } catch (e) {
        console.error("Network or Parsing Error:", e);
        // If it's a TypeError it might be because they are using file:///
        if (window.location.protocol === 'file:') {
            resultElement.innerHTML = "Local File Error (Use XAMPP)";
        } else {
            resultElement.innerHTML = "Error (See Console)";
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
    
    document.getElementById('history-list').innerHTML = "";
}

function updateHistory(historyString) {
    let newEntryHTML = `<div class='history-item'>${historyString}</div>`;
    let historyList = document.getElementById('history-list');
    // Prepend to top of the history list
    historyList.innerHTML = newEntryHTML + historyList.innerHTML;
}