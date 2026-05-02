document.addEventListener('DOMContentLoaded', () => {
    const menuGrid = document.getElementById('menu-grid');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total-price');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const tableNoInput = document.getElementById('table-no');

    let menu = [];
    let cart = [];

    // Fetch Menu
    fetch('api/get_menu.php')
        .then(res => res.json())
        .then(data => {
            menu = data;
            renderMenu();
        })
        .catch(err => {
            menuGrid.innerHTML = `<p style="color:var(--error);">Failed to load menu. Is the backend running?</p>`;
        });

    function renderMenu() {
        menuGrid.innerHTML = '';
        menu.forEach(item => {
            const card = document.createElement('div');
            card.className = 'glass-panel menu-card';
            
            // Add a default image if none provided or invalid
            const imageUrl = item.image_url && item.image_url.trim() !== '' ? item.image_url : 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600';
            
            card.innerHTML = `
                <img class="menu-img" src="${imageUrl}" alt="${item.name}">
                <div class="menu-content">
                    <div class="menu-header">
                        <h3>${item.name}</h3>
                        <span class="menu-price">$${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                    <p class="menu-desc">${item.description}</p>
                    <button class="btn-outline add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                </div>
            `;
            menuGrid.appendChild(card);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                addToCart(id);
            });
        });
    }

    // Cart Logic
    function addToCart(id) {
        const menuItem = menu.find(i => i.id === id);
        const existing = cart.find(i => i.id === id);
        
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...menuItem, quantity: 1 });
        }
        updateCartUI();
        openCart();
    }

    function updateCartQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            updateCartUI();
        }
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color: var(--outline);">Your tray is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                count += item.quantity;
                
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <span class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        cartCountEl.textContent = count;
        cartTotalEl.textContent = `$${total.toFixed(2)}`;

        document.querySelectorAll('.inc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => updateCartQty(parseInt(e.target.getAttribute('data-id')), 1));
        });
        document.querySelectorAll('.dec-btn').forEach(btn => {
            btn.addEventListener('click', (e) => updateCartQty(parseInt(e.target.getAttribute('data-id')), -1));
        });
    }

    // Cart UI toggle
    function openCart() {
        cartOverlay.classList.add('open');
        cartModal.classList.add('open');
    }
    function closeCart() {
        cartOverlay.classList.remove('open');
        cartModal.classList.remove('open');
    }

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Place Order
    placeOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Your cart is empty!');
        const tableNo = tableNoInput.value;
        if (!tableNo) return alert('Please enter your table number.');

        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = 'Processing...';

        const payload = {
            table_number: tableNo,
            items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
        };

        fetch('api/place_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Clear cart and redirect to status page
                cart = [];
                updateCartUI();
                window.location.href = `status.html?id=${data.order_id}`;
            } else {
                alert(data.error || 'Failed to place order');
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = 'Place Order <span class="material-symbols-outlined">arrow_forward</span>';
            }
        })
        .catch(err => {
            alert('Network error while placing order.');
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = 'Place Order <span class="material-symbols-outlined">arrow_forward</span>';
        });
    });
});
