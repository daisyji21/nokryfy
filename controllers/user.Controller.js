const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required at registration",
      });
    }

    // Check if already registered
    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create role-based user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "jobSeeker") {
      userData.jobSeeker = {}; // Empty, user will update later
    }

    if (role === "employer") {
      userData.company = {}; // Empty, employer will update later
    }

    // Create user
    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered",
      userId: user.userId,
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login and issue JWT
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email & Password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    // If role is specified (e.g. login as employer), check matches; otherwise ignore
    if (role && user.role !== role)
      return res.status(403).json({ success: false, message: "Role mismatch" });

    const token = jwt.sign(
      { userId: user.userId, role: user.role, email: user.email },
      process.env.JWT_SECRET || "my-secret",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout (for JWT: let frontend delete token; optionally store/revoke token server-side if using refresh tokens)
exports.logoutUser = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out" });
};

// Get any user by userId (protected: self or admin)
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow self or admin
    if (req.user.userId !== userId && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied" });

    const user = await User.findOne({ userId });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user }); // JSON cleanup handled by model
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user profile (only self or admin can update)
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied" });

    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.email; // Cannot update email

    // ✅ Avoid conflict by embedding profileLastUpdated inside jobSeeker if it exists
    if (updateData.jobSeeker) {
      updateData.jobSeeker.profileLastUpdated = new Date();
    }

    const updated = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete user (only self or admin)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Access denied" });

    const deletedUser = await User.findOneAndDelete({ userId });
    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// List all users (admin only)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
