document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Check if already logged in
    fetch('api/check_auth.php')
        .then(res => res.json())
        .then(data => {
            if (data.authenticated && data.role === 'waiter') {
                window.location.href = 'waiter.html';
            }
        });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Hide previous error
        loginError.style.display = 'none';
        
        const submitBtn = loginForm.querySelector('button');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Signing in... <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>';
        submitBtn.disabled = true;

        fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.role === 'waiter') {
                    window.location.href = 'waiter.html';
                } else {
                    window.location.href = 'index.html'; // Fallback for other roles if they existed
                }
            } else {
                loginError.textContent = data.error || 'Invalid credentials';
                loginError.style.display = 'block';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        })
        .catch(err => {
            console.error('Login error:', err);
            loginError.textContent = 'A network error occurred.';
            loginError.style.display = 'block';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
});
