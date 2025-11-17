const { createFirstPurchase } = require("../services/purchaseService");

async function buyProduct(req, res) {
  try {
    // userId is provided by authMiddleware
    const userId = req.user.id;

    const result = await createFirstPurchase(userId);

    return res.status(200).json({
      message: "Purchase successful",
      isFirstPurchase: result.isFirstPurchase,
      user: result.user,
      creditsAddedToReferrer: result.creditsAddedToReferrer,
      creditsAddedToUser: result.creditsAddedToUser,
    });
  } catch (err) {
    console.error("Buy product error:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Internal server error" });
  }
}

module.exports = {
  buyProduct,
};
