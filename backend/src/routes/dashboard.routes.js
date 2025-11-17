const express = require("express");
const { overview } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/overview", authMiddleware, overview);

module.exports = router;
