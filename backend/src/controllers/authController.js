const { registerUser, loginUser } = require("../services/authService");

async function register(req, res) {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const result = await registerUser({ name, email, password, referralCode });

    return res.status(201).json({
      message: "User registered successfully",
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    console.error("Register error:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    console.error("Login error:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Internal server error" });
  }
}

module.exports = {
  register,
  login,
};
