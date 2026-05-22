const jwt = require("jsonwebtoken");

// Verify token — blocks unauthenticated requests
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Unauthorized." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Only admins can proceed
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Admins or staff can proceed
const staffOrAdmin = (req, res, next) => {
  if (!["admin", "staff"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};

module.exports = { protect, adminOnly, staffOrAdmin };
