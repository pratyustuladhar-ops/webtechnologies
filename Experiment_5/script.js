function appendValue(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function calculate() {
    let expression = document.getElementById("display").value;
    document.getElementById("display").value = eval(expression);
}