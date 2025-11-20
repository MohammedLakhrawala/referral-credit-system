const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "referral-credit-system-liard.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
