const mysql = require('mysql');
const bcrypt = require('bcrypt');

// Kreiranje konekcije ka MySQL bazi podataka
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ssdssd442', // Unesi svoju MySQL lozinku
    database: 'users' // Unesi ime svoje baze podataka
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

const saltRounds = 10; // Broj rundi za bcrypt heširanje

async function hashAllPlainTextPasswords() {
    const querySelect = "SELECT id, username, password FROM user_accounts";
    
    db.query(querySelect, async (err, results) => {
        if (err) throw err;
        
        for (const user of results) {
            // Provera da li je lozinka plain tekst (dužina manja od 60 znakova)
            if (user.password.length < 60) {
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                
                const queryUpdate = "UPDATE user_accounts SET password = ? WHERE id = ?";
                db.query(queryUpdate, [hashedPassword, user.id], (err) => {
                    if (err) throw err;
                    console.log(`Password for user ${user.username} has been hashed.`);
                });
            }
        }
        
        // Zatvaranje konekcije nakon završetka
        db.end(err => {
            if (err) throw err;
            console.log('MySQL connection closed.');
        });
    });
}

// Pozivanje funkcije za heširanje lozinki
hashAllPlainTextPasswords();
