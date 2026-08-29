const express = require("express");
const { searchCatalog } = require("../controllers/catalogController");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

const router = express.Router();

router.get("/search", authMiddleware, requireRole("ORGANIZER"), searchCatalog);

module.exports = router;
