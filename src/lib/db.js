const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'unianalysis.db');

// Create the directory if it doesn't exist
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read/write performance
db.pragma('journal_mode = WAL');

module.exports = { db };