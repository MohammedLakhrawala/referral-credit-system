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
    origin: "https://referral-credit-system-liard.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/dashboard", dashboardRoutes);

module.exports = app;
