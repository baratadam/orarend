const sqlite3 = require("sqlite3").verbose();  // FONTOS: verbose() kell az SQL hibaüzenetekhez
const db = new sqlite3.Database("orarend.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nap TEXT,
    tantargy TEXT,
    idopont TEXT
  )`);
});

module.exports = db;
