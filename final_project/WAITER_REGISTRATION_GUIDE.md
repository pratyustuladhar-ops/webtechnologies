# Waiter Registration & Authentication System - Complete Guide

## What Was Fixed ✅

### 1. **Added Waiter Role Selection UI**
   - **Signup Page**: Now has Customer/Staff toggle buttons
   - **Login Page**: Now has Customer/Staff selection for clarity
   - **Landing Page**: Separate buttons for "Order as Customer" vs "Join as Staff"

### 2. **Enhanced Backend Registration**
   - Register API now accepts `role` parameter (customer or waiter)
   - Validates role selection
   - Returns role in response
   - Prevents duplicate usernames

### 3. **Improved User Experience**
   - Role selection with visual feedback
   - URL parameters for direct access (e.g., `signup.html?role=waiter`)
   - Clear role differentiation in forms
   - Helpful error messages

## How to Register as Waiter 🔐

### Method 1: From Landing Page
1. Go to `http://localhost/smart_cafe`
2. Click **"Join as Staff"** button (orange/gold button)
3. This pre-selects the Staff role on signup page
4. Fill in your details:
   - Full Name (e.g., "John Doe")
   - Email (e.g., "john@cafe.com")
   - Password (e.g., "SecurePass123")
5. Confirm terms & click **"Join the Ritual"**
6. You'll be redirected to login page after 2 seconds

### Method 2: From Signup Page Directly
1. Go to `http://localhost/smart_cafe/signup.html`
2. Click the **"Staff"** button (with room_service icon)
3. The Staff button will highlight in gold
4. Fill in your details
5. Click **"Join the Ritual"**

### Method 3: From Signup Page with URL Parameter
1. Go to `http://localhost/smart_cafe/signup.html?role=waiter`
2. Staff role is automatically selected
3. Fill in your details
4. Click **"Join the Ritual"**

## How to Login as Waiter 🔑

### Method 1: Standard Login
1. Go to `http://localhost/smart_cafe/login.html`
2. Click the **"Staff"** button at the top
3. Enter email/username and password (same as you registered)
4. Click **"Sign In"**
5. You'll be redirected to `waiter-dashboard.html`

### Method 2: From Index Page
1. Go to `http://localhost/smart_cafe`
2. Click **"Sign In"** button
3. Select **"Staff"** role
4. Enter credentials
5. Click **"Sign In"**

## Test Credentials 🧪

### Pre-created Waiter Account
- **Username**: `waiter1`
- **Email**: `waiter1@brewritual.com`
- **Password**: `password123`
- **Role**: Waiter

To login as this user:
1. Go to Login page
2. Click "Staff" button
3. Enter `waiter1` or `waiter1@brewritual.com` as identifier
4. Enter `password123` as password
5. Click "Sign In"

### Pre-created Customer Account
- **Username**: `demo_customer`
- **Email**: `demo@brewritual.com`
- **Password**: `password123`
- **Role**: Customer

## Registration Error Troubleshooting 🔧

If you see "An error occurred during registration", it could be:

### 1. Database Not Imported
**Solution**: Import `schema.sql` into MySQL via phpMyAdmin
```
1. Open phpMyAdmin
2. Click "Import" tab
3. Select schema.sql
4. Click "Go"
```

### 2. Email Already Registered
**Solution**: Use a different email address that hasn't been used before

### 3. Username Already Taken
**Solution**: Use a different name/username

### 4. Database Connection Issues
**Solution**: Check `api/db.php` credentials:
```php
$host = 'localhost';
$dbname = 'smart_cafe';
$username = 'root';
$password = '';
```

**Test connection**: Visit `http://localhost/smart_cafe/test.php`

## Waiter Dashboard Features 👨‍💼

Once logged in as staff, you'll see:

### Order Management Board
- **Pending Column**: New orders waiting to be prepared
- **Preparing Column**: Orders currently being made
- **Ready Column**: Orders ready for pickup
- **Served Column**: Completed orders

### Order Card Details
- Order ID (e.g., #0001)
- Table Number (e.g., "Table 5")
- Customer Name (e.g., "John" or "Guest")
- Time since order placed (e.g., "5m ago")
- Items in order (e.g., "2x Espresso, 1x Croissant")
- Delay warning (red icon if >15 minutes)

### Actions Available
1. **Start Preparing**: Move order from Pending → Preparing
2. **Mark Ready**: Move order from Preparing → Ready
3. **Mark Delivered**: Move order from Ready → Served

### Real-time Updates
- Dashboard updates every 3 seconds
- New orders appear automatically
- Customers see status changes in real-time
- Order timestamps update continuously

## Role-Based Access Control ✅

### Customer Account Can Access:
- ✅ Customer Dashboard (menu browsing)
- ✅ Place Orders
- ✅ Track Order Status
- ❌ Cannot access Waiter Dashboard
- ❌ Cannot update order status

### Waiter Account Can Access:
- ✅ Waiter Dashboard (order management)
- ✅ Update Order Status
- ✅ View Active Orders
- ❌ Cannot browse menu as customer
- ❌ Cannot place orders

### Login Role Validation:
If you register as Customer but try to login as Staff with those credentials:
- ✅ Login will fail with message: "This account is registered as a customer. Please select the correct role."
- You must select the matching role during login

## API Endpoints for Registration 🔌

### Register New User
```
POST /api/register.php
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@cafe.com",
  "password": "SecurePass123",
  "role": "waiter"  // "customer" or "waiter"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "role": "waiter"
}
```

### Login User
```
POST /api/login.php
Content-Type: application/json

{
  "email": "john@cafe.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "role": "waiter",
  "message": "Login successful"
}
```

### Check Authentication
```
GET /api/check_auth.php

Response:
{
  "authenticated": true,
  "user_id": 2,
  "role": "waiter",
  "username": "John Doe"
}
```

## UI/UX Improvements Made 🎨

1. **Role Selection Buttons**
   - Coffee icon for Customer
   - Room service icon for Staff
   - Clear visual indication of selected role
   - Smooth transitions and hover effects

2. **Landing Page**
   - Separate CTA buttons for different user types
   - Clear distinction between customer and staff signup
   - "Sign In" option for existing users

3. **Form Feedback**
   - Success messages with role confirmation
   - Clear error messages for validation issues
   - Loading states with appropriate messaging
   - Auto-redirect on successful registration

4. **Accessibility**
   - Material Design icons for clear visual communication
   - Color-coded buttons for distinction
   - Proper ARIA labels and semantic HTML
   - Mobile-responsive role selection

## Testing Checklist ✓

- [ ] Can register as Customer
- [ ] Can register as Staff/Waiter
- [ ] Can login with each role
- [ ] Login redirects to correct dashboard
- [ ] Role validation prevents wrong role login
- [ ] Waiter dashboard shows orders
- [ ] Can update order status as waiter
- [ ] Customer can track order status in real-time
- [ ] URL parameters work (e.g., ?role=waiter)
- [ ] Mobile responsiveness works
- [ ] Error messages display correctly

## Common Issues & Fixes 🛠️

| Issue | Solution |
|-------|----------|
| "Email already registered" | Use a different email address |
| "Username already taken" | Use a different name |
| "Database connection failed" | Check credentials in api/db.php |
| "Role mismatch error" | Select the correct role that matches your registration |
| Can't see waiter dashboard | Make sure you're logged in as Staff, not Customer |
| Orders not updating | Refresh page or wait 3 seconds for polling |

## Next Steps 🚀

1. **Import Database**: If not done, import schema.sql
2. **Test Customer Registration**: Create a customer account
3. **Test Staff Registration**: Create a staff/waiter account
4. **Test Workflows**: 
   - Place order as customer
   - Update order status as staff
   - Track order in real-time
5. **Mobile Testing**: Test on mobile devices
6. **Production**: Deploy to web server with SSL/TLS

## Questions? 💬

For detailed system architecture, see `SETUP_GUIDE.md` or `FIXES_SUMMARY.md`
