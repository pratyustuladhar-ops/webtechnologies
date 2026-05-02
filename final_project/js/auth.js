document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Parse URL for ?tab= parameter
    const urlParams = new URLSearchParams(window.location.search);
    const defaultTab = urlParams.get('tab');
    if (defaultTab) {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        const activeTab = document.querySelector(`.tab[data-tab="${defaultTab}"]`);
        const activeContent = document.getElementById(`tab-${defaultTab}`);
        
        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeContent.classList.add('active');
        } else {
             // Fallback
             tabs[0].classList.add('active');
             tabContents[0].classList.add('active');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`tab-${tab.getAttribute('data-tab')}`).classList.add('active');
        });
    });

    // Customer Login
    const cLoginForm = document.getElementById('customer-login-form');
    if (cLoginForm) {
        cLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('c-username').value;
            const password = document.getElementById('c-password').value;
            handleAuth('api/login.php', { username, password, role: 'customer' }, 'customer-login-error', 'customer-dashboard.html');
        });
    }

    // Staff Login
    const sLoginForm = document.getElementById('staff-login-form');
    if (sLoginForm) {
        sLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('s-username').value;
            const password = document.getElementById('s-password').value;
            handleAuth('api/login.php', { username, password, role: 'waiter' }, 'staff-login-error', 'waiter-dashboard.html');
        });
    }

    // Customer Registration
    const cRegisterBtn = document.getElementById('customer-register-btn');
    if (cRegisterBtn) {
        cRegisterBtn.addEventListener('click', () => {
            const username = document.getElementById('c-username').value;
            const password = document.getElementById('c-password').value;
            const errorEl = document.getElementById('customer-login-error');
            const successEl = document.getElementById('customer-register-success');
            
            errorEl.style.display = 'none';
            successEl.style.display = 'none';

            if (!username || !password) {
                errorEl.textContent = 'Please enter a username and password to register';
                errorEl.style.display = 'block';
                return;
            }

            fetch('api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    successEl.textContent = 'Account created! You can now sign in.';
                    successEl.style.display = 'block';
                } else {
                    errorEl.textContent = data.error;
                    errorEl.style.display = 'block';
                }
            })
            .catch(err => {
                errorEl.textContent = 'Network error during registration.';
                errorEl.style.display = 'block';
            });
        });
    }

    function handleAuth(url, payload, errorElementId, redirectUrl) {
        const errorEl = document.getElementById(errorElementId);
        errorEl.style.display = 'none';

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = redirectUrl;
            } else {
                errorEl.textContent = data.error || 'Authentication failed';
                errorEl.style.display = 'block';
            }
        })
        .catch(err => {
            errorEl.textContent = 'Network error.';
            errorEl.style.display = 'block';
        });
    }
});
