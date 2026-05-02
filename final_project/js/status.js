document.addEventListener('DOMContentLoaded', () => {
    // Optional Auth check for nav bar
    fetch('api/check_auth.php')
        .then(res => res.json())
        .then(data => {
            const loginBtn = document.getElementById('nav-login-btn');
            if (data.authenticated && loginBtn) {
                if (data.role === 'customer') {
                    loginBtn.textContent = 'Logout';
                    loginBtn.href = '#';
                    loginBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        fetch('api/logout.php').then(() => window.location.href = 'index.html');
                    });
                } else {
                    loginBtn.textContent = 'Staff Portal';
                    loginBtn.href = 'waiter-dashboard.html';
                }
            }
        });

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    const container = document.getElementById('status-container');

    if (!orderId) {
        container.innerHTML = `<h2 style="color:var(--error);">Invalid Order</h2><p>No order ID provided.</p>`;
        return;
    }

    function fetchStatus() {
        fetch(`api/get_order_status.php?id=${orderId}`)
            .then(res => {
                if (!res.ok) throw new Error('Order not found');
                return res.json();
            })
            .then(order => {
                renderStatus(order);
            })
            .catch(err => {
                container.innerHTML = `
                    <h2 style="color:var(--error);">Order Not Found</h2>
                    <p>We couldn't locate order #${orderId}. Please check the ID or contact staff.</p>
                `;
            });
    }

    function renderStatus(order) {
        const statuses = ['Pending', 'Preparing', 'Ready', 'Served'];
        const currentIdx = statuses.indexOf(order.status);
        const progressPercent = currentIdx >= 0 ? (currentIdx / (statuses.length - 1)) * 100 : 0;

        const itemsHtml = order.items.map(i => `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>${i.quantity}x ${i.name}</span>
                <span style="color:var(--outline);">$${parseFloat(i.price).toFixed(2)}</span>
            </div>
        `).join('');

        const isComplete = order.status === 'Served';

        container.innerHTML = `
            <h2 class="section-title">Order #${order.id.toString().padStart(4, '0')}</h2>
            
            <div class="progress-bar">
                <div class="progress-line" style="width: ${progressPercent}%;"></div>
                ${statuses.map((s, idx) => `
                    <div class="step ${idx <= currentIdx ? 'active' : ''} ${idx < currentIdx ? 'done' : ''}">
                        <div class="step-icon">
                            <span class="material-symbols-outlined">
                                ${idx === 0 ? 'hourglass_empty' : idx === 1 ? 'local_cafe' : idx === 2 ? 'room_service' : 'done_all'}
                            </span>
                        </div>
                        <span style="font-size: 14px; color: ${idx <= currentIdx ? 'var(--primary-container)' : 'var(--outline)'}; font-weight: ${idx === currentIdx ? 'bold' : 'normal'};">${s}</span>
                    </div>
                `).join('')}
            </div>

            <div class="status-details" style="text-align: left;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--surface-variant); padding-bottom: 16px; margin-bottom: 16px;">
                    <div>
                        <div style="color:var(--outline); font-size:14px;">Status</div>
                        <div style="font-size:24px; color:var(--primary-container); font-weight:bold;">${order.status}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color:var(--outline); font-size:14px;">Table Number</div>
                        <div style="font-size:24px; font-weight:bold;">${order.table_number}</div>
                    </div>
                </div>

                <h4 style="color:var(--outline); margin-bottom:16px;">Order Summary</h4>
                ${itemsHtml}
                
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--surface-variant); padding-top: 16px; margin-top: 16px; font-weight: bold; font-size: 18px;">
                    <span>Total</span>
                    <span style="color:var(--primary-container);">$${parseFloat(order.total_price).toFixed(2)}</span>
                </div>
                
                ${isComplete ? `
                    <div style="margin-top:24px; text-align:center;">
                        <a href="customer-dashboard.html" class="btn-primary">Order Again</a>
                    </div>
                ` : ''}
            </div>
        `;
    }

    fetchStatus();
    // Poll every 3 seconds
    setInterval(fetchStatus, 3000);
});
