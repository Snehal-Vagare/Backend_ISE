const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "change_this_secret_in_production";

// AUTHENTICATION: is the user logged in? (valid token)
function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token, please login" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// AUTHORIZATION: does the user have the right role?
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied: admin only" });
  }
  next();
};

module.exports = { authenticate, authorize, SECRET };
