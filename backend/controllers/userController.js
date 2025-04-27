const db = require('../database');

// CREATE
const createUser = (req, res) => {
  const { login, password } = req.body;
  db.run(
    `INSERT INTO users (login, password) VALUES (?, ?)`,
    [login, password],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
};

// READ (All)
const getUsers = (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// READ (Single)
const getUser = (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row || {});
  });
};

// UPDATE
const updateUser = (req, res) => {
  const { login, password } = req.body;
  db.run(
    `UPDATE users SET login = ?, password = ? WHERE id = ?`,
    [login, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
};

// DELETE
const deleteUser = (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};