const { getOverview } = require("../services/dashboardService");

async function overview(req, res) {
  try {
    const userId = req.user.id; // from authMiddleware
    const data = await getOverview(userId);
    return res.status(200).json({ message: "Overview fetched", data });
  } catch (err) {
    console.error("Dashboard overview error:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Internal server error" });
  }
}

module.exports = { overview };
