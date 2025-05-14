import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Optional: Fehler beim Verbindungsaufbau loggen
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); // Prozess beenden bei kritischem Fehler
});

// Funktion zum Ausführen von Querys über den Pool
export const query = (text, params) => pool.query(text, params);

// Optional: Verbindung beim App-Start testen
export async function testDbConnection() {
    try {
        const client = await pool.connect();
        console.log('Database connection pool connected successfully!');
        client.release(); // Verbindung zurückgeben
    } catch (err) {
        console.error('Database connection pool initial connection error:', err);
        // Handle error: Log, exit?
        // process.exit(1);
    }
}

// Beim API-Start aufrufen:
// testDbConnection();

export default pool;