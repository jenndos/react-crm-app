const db = require('../database');

class User {
  static createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT,
      password TEXT
    )`);
  }

  // Schema validations can go here
}

module.exports = User;