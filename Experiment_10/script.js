document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('expense-form');
    const amountInput = document.getElementById('amount');
    const titleInput = document.getElementById('title');
    const dateInput = document.getElementById('date');

    form.addEventListener('submit', function (event) {
        const title = titleInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const date = dateInput.value;

        if (!title || !date || isNaN(amount) || amount <= 0) {
            event.preventDefault();
            alert('Please enter a valid title, positive amount, and selected date.');
            return;
        }
    });
});

function confirmDelete() {
    return confirm('Are you sure you want to delete this expense?');
}
