const mongoose = require("mongoose");
const User = require("../models/User");
const Referral = require("../models/Referral");
const Purchase = require("../models/Purchase");

/**
 * Handles the "buy product" action.
 * - Checks if this is the user's first purchase
 * - If first purchase AND user was referred AND referral is pending:
 *   - Mark referral as converted
 *   - Add credits to referrer and referred user
 */
async function createFirstPurchase(userId) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Check if user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // 2. Check if user already has a purchase (not first)
    const existingPurchase = await Purchase.findOne({ userId }).session(session);

    const isFirstPurchase = !existingPurchase;

    // 3. Always record this purchase (assignment wants tracking)
    const newPurchase = await Purchase.create(
      [{ userId }],
      { session }
    );

    let creditsAddedToReferrer = 0;
    let creditsAddedToUser = 0;

    // 4. If first purchase and user was referred by someone
    if (isFirstPurchase && user.referredBy) {
      // Find the referral record for this user
      let referral = await Referral.findOne({
        referredId: user._id,
      }).session(session);

      if (referral && referral.status === "pending") {
        // Mark referral as converted
        referral.status = "converted";
        referral.convertedAt = new Date();
        await referral.save({ session });

        // Increment credits: +2 to referrer and +2 to referred user
        const REFERRAL_CREDIT = 2;

        await User.findByIdAndUpdate(
          user.referredBy,
          { $inc: { credits: REFERRAL_CREDIT } },
          { new: true, session }
        );

        await User.findByIdAndUpdate(
          user._id,
          { $inc: { credits: REFERRAL_CREDIT } },
          { new: true, session }
        );

        creditsAddedToReferrer = REFERRAL_CREDIT;
        creditsAddedToUser = REFERRAL_CREDIT;
      }
      // else: referral either not found or already converted -> no extra credits
    }

    // 5. Get fresh user data to return updated credits
    const updatedUser = await User.findById(userId).session(session);

    await session.commitTransaction();
    session.endSession();

    return {
      isFirstPurchase,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        referralCode: updatedUser.referralCode,
        credits: updatedUser.credits,
      },
      creditsAddedToReferrer,
      creditsAddedToUser,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = {
  createFirstPurchase,
};
