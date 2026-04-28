document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    const container = document.getElementById('status-container');

    if (!orderId) {
        container.innerHTML = `<h2 style="color:var(--error);">No Order ID provided</h2><a href="index.html" class="btn-primary" style="margin-top:20px;">Return to Menu</a>`;
        return;
    }

    const statuses = ['Pending', 'Preparing', 'Ready', 'Served'];

    function fetchStatus() {
        fetch(`api/get_order_status.php?id=${orderId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    container.innerHTML = `<h2 style="color:var(--error);">${data.error}</h2>`;
                    return;
                }
                renderStatus(data);
            })
            .catch(err => console.error('Error fetching status:', err));
    }

    function renderStatus(order) {
        let currentIdx = statuses.indexOf(order.status);
        if(currentIdx === -1) currentIdx = 0;
        
        let progressPercent = (currentIdx / (statuses.length - 1)) * 100;

        let stepsHtml = statuses.map((status, index) => {
            let className = '';
            if (index < currentIdx) className = 'done';
            else if (index === currentIdx) className = 'active';

            let icon = 'receipt_long';
            if (status === 'Preparing') icon = 'coffee_maker';
            if (status === 'Ready') icon = 'local_cafe';
            if (status === 'Served') icon = 'check_circle';

            return `
                <div class="step ${className}">
                    <div class="step-icon">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <span style="font-size:12px; color: ${index <= currentIdx ? 'var(--primary-container)' : 'var(--outline)'}; font-weight: ${index === currentIdx ? 'bold' : 'normal'};">${status}</span>
                </div>
            `;
        }).join('');

        let itemsHtml = order.items.map(item => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--surface-variant); padding:8px 0; margin-bottom:8px;">
                <span style="color:var(--on-surface);"><span style="color:var(--primary-container); margin-right:8px;">${item.quantity}x</span> ${item.name}</span>
                <span style="color:var(--outline);">$${parseFloat(item.price).toFixed(2)}</span>
            </div>
        `).join('');

        container.innerHTML = `
            <p style="text-transform:uppercase; letter-spacing:0.1em; color:var(--outline);">Order #${order.id.toString().padStart(4, '0')}</p>
            <h1 style="color:var(--primary-container); margin-bottom:8px;">Your Ritual is ${order.status}</h1>
            <p style="color:var(--outline);">Table Number: <strong style="color:white;">${order.table_number}</strong></p>

            <div class="progress-bar">
                <div class="progress-line" style="width: ${progressPercent}%;"></div>
                ${stepsHtml}
            </div>

            <div class="status-details glass-panel" style="text-align:left; margin-top:40px;">
                <div style="text-align:center; padding-bottom:24px; border-bottom:1px solid var(--surface-variant); margin-bottom:24px;">
                    <span class="material-symbols-outlined" style="font-size:36px; color:var(--primary-container); opacity:0.8; margin-bottom:16px;">timer</span>
                    <h3 style="margin-bottom:8px;">Estimated Brew Time</h3>
                    <div style="font-size:48px; color:var(--primary-container); line-height:1; font-family:var(--font-serif);">${order.status === 'Served' ? '0' : order.estimated_wait_minutes} min</div>
                </div>
                ${itemsHtml}
                <div style="display:flex; justify-content:space-between; margin-top:16px; font-weight:bold; font-size:20px;">
                    <span>Total</span>
                    <span style="color:var(--primary-container);">$${parseFloat(order.total_price).toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    // Initial fetch and poll every 3 seconds
    fetchStatus();
    setInterval(fetchStatus, 3000);
});
