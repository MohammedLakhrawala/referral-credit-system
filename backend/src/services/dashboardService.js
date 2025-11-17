// backend/src/services/dashboardService.js
const User = require("../models/User");
const Referral = require("../models/Referral");
const Purchase = require("../models/Purchase");

/**
 * Get overview for the dashboard for a given userId.
 * Returns counts and a small list of recent referrals.
 */
async function getOverview(userId) {
  // 1. Load user (to get referralCode, credits, referredBy)
  const user = await User.findById(userId).lean();
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  // 2. Referrals where this user is the referrer
  const totalReferrals = await Referral.countDocuments({ referrerId: userId });
  const convertedReferrals = await Referral.countDocuments({
    referrerId: userId,
    status: "converted",
  });
  const pendingReferrals = await Referral.countDocuments({
    referrerId: userId,
    status: "pending",
  });

  // 3. Recent referral list (join with User to return name/email)
  const recentReferralsRaw = await Referral.find({ referrerId: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Fetch user details for each referredId
  const referredIds = recentReferralsRaw.map((r) => r.referredId);
  const referredUsers = await User.find({ _id: { $in: referredIds } })
    .select("name email createdAt")
    .lean();

  const referredMap = new Map();
  for (const ru of referredUsers) {
    referredMap.set(String(ru._id), ru);
  }

  const recentReferrals = recentReferralsRaw.map((r) => {
    const ru = referredMap.get(String(r.referredId)) || {};
    return {
      id: r._id,
      name: ru.name || null,
      email: ru.email || null,
      status: r.status,
      createdAt: r.createdAt,
      convertedAt: r.convertedAt || null,
    };
  });

  // 4. Purchases count for this user
  const totalPurchases = await Purchase.countDocuments({ userId });

  // 5. Build the response
  return {
    referralCode: user.referralCode,
    credits: user.credits || 0,
    totalReferrals,
    convertedReferrals,
    pendingReferrals,
    recentReferrals,
    totalPurchases,
    isReferrer: totalReferrals > 0,
  };
}

module.exports = { getOverview };
