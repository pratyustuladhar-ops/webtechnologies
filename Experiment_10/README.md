# Expense Tracker (Experiment_10)

A simple PHP + MySQL expense tracker built for deployment on free shared hosts like InfinityFree.

## Deployment Checklist

1. Create a new MySQL database in your InfinityFree control panel.
2. Set the host, username, password, and database name in `db.php`.
   - InfinityFree typically provides these values in the hosting dashboard.
   - Example:
     - `host = 'sqlXXX.epizy.com'`
     - `user = 'epiz_12345678'`
     - `password = 'yourpassword'`
     - `database = 'epiz_12345678_expenses'`
3. Import `schema.sql` into your InfinityFree database using phpMyAdmin.
4. Upload the entire `Experiment_10` folder to your InfinityFree account root.
5. Open `index.php` in the browser to start using the app.

## Notes

- `index.php` contains the full CRUD app UI and backend logic.
- `db.php` handles the database connection and sanitization.
- `style.css` and `script.js` are static frontend resources.
- The app uses prepared statements to prevent SQL injection.

## InfinityFree Compatibility

- The app uses vanilla PHP and does not require Composer.
- All assets are local, so no external dependencies are needed.
- Use `index.php` as the default entry point.
