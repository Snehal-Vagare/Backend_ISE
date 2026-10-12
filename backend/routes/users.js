const express = require("express");
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/users  -> ADMIN only (never send passwords)
router.get("/", authenticate, authorize("admin"), (req, res) => {
  res.json(db.getUsers().map(({ password, ...safe }) => safe));
});

module.exports = router;
