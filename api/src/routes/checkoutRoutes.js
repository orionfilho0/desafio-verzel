const express = require("express");
const { checkout } = require("../controllers/checkoutController");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

const router = express.Router();

router.post("/", authMiddleware, requireRole("CLIENT"), checkout);

module.exports = router;
