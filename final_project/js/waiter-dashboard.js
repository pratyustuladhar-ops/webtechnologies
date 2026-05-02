document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    fetch('api/check_auth.php')
        .then(res => res.json())
        .then(data => {
            if (!data.authenticated || data.role !== 'waiter') {
                window.location.href = 'login.html';
            } else {
                document.getElementById('waiter-welcome').innerHTML = `<span class="material-symbols-outlined" style="vertical-align:middle;">person</span> ${data.username}`;
                initDashboard();
            }
        })
        .catch(() => window.location.href = 'login.html');

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('api/logout.php').then(() => window.location.href = 'index.html');
        });
    }

    const colPending = document.getElementById('col-pending');
    const colPreparing = document.getElementById('col-preparing');
    const colReady = document.getElementById('col-ready');

    const countPending = document.getElementById('count-pending');
    const countPreparing = document.getElementById('count-preparing');
    const countReady = document.getElementById('count-ready');

    function initDashboard() {
        fetchOrders();
        setInterval(fetchOrders, 3000); // Polling every 3s
    }

    function fetchOrders() {
        fetch('api/waiter_orders.php')
            .then(res => res.json())
            .then(orders => renderKanban(orders))
            .catch(err => console.error('Failed to fetch orders:', err));
    }

    function timeSince(dateString) {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 60);
        if (interval < 1) return 'Just now';
        return interval + 'm ago';
    }

    function renderKanban(orders) {
        let pending = [], preparing = [], ready = [];

        if (Array.isArray(orders)) {
            orders.forEach(order => {
                if (order.status === 'Pending') pending.push(order);
                if (order.status === 'Preparing') preparing.push(order);
                if (order.status === 'Ready') ready.push(order);
            });
        }

        countPending.textContent = pending.length;
        countPreparing.textContent = preparing.length;
        countReady.textContent = ready.length;

        colPending.innerHTML = pending.map(o => createOrderCard(o, 'Preparing', 'play_arrow', 'Start Preparing', 'btn-outline')).join('');
        colPreparing.innerHTML = preparing.map(o => createOrderCard(o, 'Ready', 'check', 'Mark Ready', 'btn-primary')).join('');
        colReady.innerHTML = ready.map(o => createOrderCard(o, 'Served', 'done_all', 'Mark Delivered', 'btn-outline', 'color:var(--success); border-color:var(--success);')).join('');

        document.querySelectorAll('.update-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                updateOrderStatus(target.getAttribute('data-id'), target.getAttribute('data-next'));
            });
        });
    }

    function createOrderCard(order, nextStatus, icon, actionText, actionClass, customBtnStyle = '') {
        const itemsHtml = order.items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('');
        const isDelayed = (new Date() - new Date(order.created_at)) / 1000 / 60 > 15 && order.status === 'Pending';
        const borderStyle = isDelayed ? 'border-color: var(--error); box-shadow: inset 0 0 5px rgba(255,0,0,0.3);' : '';

        // Safely extract customer name from API if added, fallback to Guest
        const customerName = order.customer_name || 'Guest';

        return `
            <div class="order-card" style="${borderStyle}">
                <div class="order-card-header">
                    <div>
                        <div class="order-id">#${order.id.toString().padStart(4, '0')}</div>
                        <div class="order-time">Table ${order.table_number} &bullet; ${customerName} &bullet; ${timeSince(order.created_at)}</div>
                    </div>
                    ${isDelayed ? '<span class="material-symbols-outlined" style="color:var(--error);">warning</span>' : ''}
                </div>
                <ul class="order-items-list">
                    ${itemsHtml}
                </ul>
                <button class="${actionClass} update-status-btn" style="width: 100%; justify-content: center; ${customBtnStyle}" data-id="${order.id}" data-next="${nextStatus}">
                    <span class="material-symbols-outlined" style="font-size:18px;">${icon}</span> ${actionText}
                </button>
            </div>
        `;
    }

    function updateOrderStatus(orderId, status) {
        fetch('api/update_order_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, status: status })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) fetchOrders();
            else alert('Error updating status');
        });
    }
});
