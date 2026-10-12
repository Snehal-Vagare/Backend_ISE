const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { SECRET, authenticate } = require("../middleware/auth");

const router = express.Router();

const makeToken = (u) =>
  jwt.sign({ id: u.id, name: u.name, email: u.email, role: u.role }, SECRET, { expiresIn: "2h" });

// POST /api/auth/register  (new users always get the "user" role)
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

  const users = db.getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ message: "Email already registered" });

  const user = { id: Date.now(), name, email, password: bcrypt.hashSync(password, 10), role: "user" };
  users.push(user);
  db.saveUsers(users);
  res.status(201).json({ message: "Registered successfully" });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.getUsers().find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || !bcrypt.compareSync(password || "", user.password))
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    token: makeToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));

module.exports = router;
