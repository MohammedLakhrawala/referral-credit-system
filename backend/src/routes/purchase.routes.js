const express = require("express");
const { buyProduct } = require("../controllers/purchaseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route: user must be logged in (JWT)
router.post("/buy", authMiddleware, buyProduct);

module.exports = router;
