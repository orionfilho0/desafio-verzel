const express = require("express");
const { validateTicket } = require("../controllers/gateController");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

const router = express.Router();

router.post("/validate", authMiddleware, requireRole("GATE"), validateTicket);

module.exports = router;
