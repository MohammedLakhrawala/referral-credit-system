const User = require("../models/User");
const Referral = require("../models/Referral");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateReferralCode } = require("../utils/referralCode");
const { signToken } = require("../utils/jwt");

async function registerUser({ name, email, password, referralCode }) {
  // 1. Check existing user
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error("Email is already registered");
    error.statusCode = 400;
    throw error;
  }

  // 2. Hash password
  const passwordHash = await hashPassword(password);

  // 3. Generate unique referralCode for this new user
  const userReferralCode = generateReferralCode();

  // 4. Handle referrer if referralCode passed
  let referrer = null;
  if (referralCode) {
    referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
  }

  // 5. Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    referralCode: userReferralCode,
    referredBy: referrer ? referrer._id : null,
    credits: 0,
  });

  // 6. Create Referral record if referrer exists
  if (referrer) {
    await Referral.create({
      referrerId: referrer._id,
      referredId: user._id,
      status: "pending",
    });
  }

  // 7. Generate JWT
  const token = signToken({ id: user._id, email: user.email });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      credits: user.credits,
    },
    token,
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ id: user._id, email: user.email });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      credits: user.credits,
    },
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};
