const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ssdssd442', 
    database: 'store'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to store MySQL database.');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const query = `INSERT INTO user_accounts (username, password) VALUES ('${username}', '${password}')`;
    db.query(query, (err) => {
        if (err) throw err;
        res.status(201).json({ message: 'User registered successfully.' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM user_accounts WHERE username = '${username}' AND password = '${password}'`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
            res.json({ message: 'Login successful', isAdmin: results[0].is_admin });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.get('/products', (req, res) => {
    const isAdmin = req.query.isAdmin === 'true' || req.query.isAdmin === true || req.query.isAdmin === '1';

    const query = isAdmin ? 
        `SELECT * FROM products` : 
        `SELECT * FROM products WHERE is_admin_only = FALSE`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ message: 'Server error' });
        }

        res.json(results);
    });
});

app.get('/products/search', (req, res) => {
    const { description } = req.query;
    const isAdmin = req.query.isAdmin === 'true' || req.query.isAdmin === true || req.query.isAdmin === '1';

    const query = isAdmin ? 
        `SELECT * FROM products WHERE description LIKE '%${description}%'` : 
        `SELECT * FROM products WHERE description LIKE '%${description}%' AND is_admin_only = FALSE`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ message: 'Server error' });
        }

        res.json(results);
    });
});

app.put('/products/update/:id', (req, res) => {
    const productId = req.params.id;
    const { name, price, description, is_admin_only } = req.body;
    const isAdmin = req.query.isAdmin === 'true' || req.query.isAdmin === true || req.query.isAdmin === '1';

    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied. Only admins can update products.' });
    }

    const query = `UPDATE products SET name = '${name}', price = ${price}, description = '${description}', is_admin_only = ${is_admin_only} WHERE id = ${productId}`;
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({ message: 'Error updating product.' });
        }
        res.json({ message: 'Product updated successfully.' });
    });
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
