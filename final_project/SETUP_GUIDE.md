# Smart Cafe - Setup & Test Guide

## Database Setup
1. Open phpMyAdmin
2. Import `schema.sql` into your MySQL server
3. This creates the `smart_cafe` database with all tables and sample data

## Default Credentials
- **Waiter Username**: `waiter1`, **Password**: `password123`
- **Customer Username**: `demo_customer`, **Password**: `password123`

## User Flows

### 1. Customer Flow
1. Visit `index.html` - landing page
2. Click "Order Now" → redirects to `signup.html`
3. Create account or go to `login.html` to sign in
4. After login → redirects to `customer-dashboard.html`
5. Browse menu, add items to cart, enter table number
6. Place order → redirects to `status.html` to track order
7. Real-time status updates (polls every 3 seconds)

### 2. Waiter Flow
1. Visit `login.html`
2. Login with waiter credentials (waiter1 / password123)
3. After login → redirects to `waiter-dashboard.html`
4. View Kanban board with Pending, Preparing, Ready columns
5. Click action buttons to move orders through workflow
6. Real-time order updates (polls every 3 seconds)

### 3. Guest Customer (No Account)
1. Table number is stored with order
2. Can still track order status via order ID

## File Structure
```
smart_cafe/
├── index.html                 # Landing page
├── login.html                 # Login page (customers & waiters)
├── signup.html                # Registration page (customers only)
├── customer-dashboard.html    # Menu & orders page
├── waiter-dashboard.html      # Waiter order management
├── waiter.html                # Alternative waiter dashboard
├── status.html                # Order status tracking
├── schema.sql                 # Database schema
├── api/
│   ├── check_auth.php         # Auth verification
│   ├── db.php                 # Database connection
│   ├── get_menu.php           # Fetch menu items
│   ├── get_order_status.php   # Get single order details
│   ├── login.php              # User authentication
│   ├── logout.php             # Session logout
│   ├── my_orders.php          # Customer's orders
│   ├── place_order.php        # Create new order
│   ├── register.php           # User registration
│   ├── update_order_status.php # Update order status
│   └── waiter_orders.php      # Active orders for waiters
├── js/
│   ├── customer-dashboard.js  # Menu & cart logic
│   ├── waiter-dashboard.js    # Waiter board logic
│   ├── waiter.js              # Alternative waiter board
│   ├── login.js               # Legacy login handler
│   ├── status.js              # Order tracking logic
│   └── auth.js                # Legacy auth handler
└── css/
    └── style.css              # All styling
```

## API Endpoints

### Authentication
- `POST /api/login.php` - Login (accepts email/username + password)
- `POST /api/register.php` - Register (full_name, email, password)
- `GET /api/check_auth.php` - Check authentication status
- `GET /api/logout.php` - Logout

### Menu
- `GET /api/get_menu.php` - Fetch all available menu items

### Orders (Customer)
- `POST /api/place_order.php` - Create new order (table_number, items)
- `GET /api/my_orders.php` - Get customer's orders (requires auth)
- `GET /api/get_order_status.php?id=<order_id>` - Get order details

### Orders (Waiter)
- `GET /api/waiter_orders.php` - Get active orders (requires waiter role)
- `POST /api/update_order_status.php` - Update order status (requires waiter role)

## Features Implemented

✅ User Authentication (Login/Signup)
✅ Role-based Access (Customer/Waiter)
✅ Menu Display with Images
✅ Shopping Cart (Add/Remove Items)
✅ Order Placement
✅ Order Status Tracking (Real-time polling)
✅ Waiter Dashboard (Kanban board)
✅ Order Status Workflow (Pending → Preparing → Ready → Served)
✅ Responsive Design (Mobile-friendly)
✅ Session Management
✅ Error Handling

## Testing Checklist

### 1. Authentication
- [ ] Register new customer account
- [ ] Login with customer credentials
- [ ] Login with waiter credentials
- [ ] Verify incorrect password shows error
- [ ] Verify logout functionality
- [ ] Test session persistence

### 2. Customer Dashboard
- [ ] Verify menu loads correctly
- [ ] Add items to cart
- [ ] Modify quantities in cart
- [ ] Remove items from cart
- [ ] Enter table number
- [ ] Place order successfully
- [ ] Verify redirect to status page

### 3. Order Tracking
- [ ] View order details on status page
- [ ] See real-time status updates
- [ ] Verify order ID and table number display
- [ ] Check order total and items list
- [ ] See progress bar updates

### 4. Waiter Dashboard
- [ ] Verify active orders appear in Pending column
- [ ] Move order from Pending → Preparing
- [ ] Move order from Preparing → Ready
- [ ] Move order from Ready → Served
- [ ] Verify customer sees status updates in real-time
- [ ] Test with multiple simultaneous orders

### 5. UI/UX
- [ ] Test on desktop browser
- [ ] Test on mobile browser
- [ ] Verify responsive cart modal on mobile
- [ ] Check form validation
- [ ] Verify all buttons are clickable
- [ ] Check color scheme and styling

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: Check database credentials in `api/db.php`. Default is:
- Host: `localhost`
- User: `root`
- Password: `` (empty)
- Database: `smart_cafe`

### Issue: "Order placed but cart doesn't clear"
**Solution**: This is normal. Cart clears after successful redirect to status page.

### Issue: "Real-time updates not working"
**Solution**: Check browser console for errors. Ensure polling endpoints are returning valid JSON.

### Issue: "Menu images not loading"
**Solution**: Images load from Unsplash. Check internet connection and CORS settings.

## Performance Notes
- Menu is cached on client-side (no refetch on add-to-cart)
- Orders poll every 3 seconds for near real-time updates
- Database uses prepared statements to prevent SQL injection
- Sessions expire after browser close (default PHP session timeout)

## Security Notes
- All passwords are hashed using PHP's PASSWORD_DEFAULT algorithm
- SQL injection prevented using prepared statements
- CSRF protection via session-based auth
- No sensitive data in localStorage
- All API endpoints validate role-based access

## Future Enhancements
- WebSocket for true real-time updates instead of polling
- Email notifications when order is ready
- Payment integration
- Order history and analytics
- Staff management panel
- Customizable menu with admin panel
