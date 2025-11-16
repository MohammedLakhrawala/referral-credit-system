function generateReferralCode() {
  // 8-char uppercase alphanumeric code, e.g. A9F3K2L8
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = { generateReferralCode };
