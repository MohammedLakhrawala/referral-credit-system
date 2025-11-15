const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// TODO: attach routes later
// const authRoutes = require("./routes/auth.routes");
// app.use("/api/auth", authRoutes);

module.exports = app;
