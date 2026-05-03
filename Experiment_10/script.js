document.addEventListener('DOMContentLoaded', function() {
    // We grab the form when the page completely loads
    var form = document.getElementById('guestbookForm');
    
    form.addEventListener('submit', function(event) {
        var nameInput = document.getElementById('guest_name').value.trim();
        var messageInput = document.getElementById('guest_message').value.trim();
        
        // Classic Javascript Validations
        if (nameInput.length < 2) {
            alert("Whoops! Please enter a valid name (at least 2 characters).");
            event.preventDefault(); // Stop form submission
            return;
        }
        
        if (messageInput.length < 5) {
            alert("Your message is too short. Please write at least 5 characters.");
            event.preventDefault(); // Stop form submission
            return;
        }
        
        // A very classic JS pop-up confirmation
        var confirmSubmission = confirm("Are you sure you want to post this message to the public Guestbook?");
        if (!confirmSubmission) {
            event.preventDefault(); // Cancel submission if they click 'Cancel'
        }
    });
});