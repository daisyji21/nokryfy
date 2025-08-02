const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendError = (res, code, message, details = null) => {
  res.status(code).json({
    code,
    success: false,
    message,
    data: null,
    ...(details && { details }),
  });
};

const sendSuccess = (res, code, message, data = null) => {
  res.status(code).json({
    code,
    success: true,
    message,
    data,
  });
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password || !role) {
      return sendError(
        res,
        400,
        "Name, email, password, and role are required"
      );
    }

    if (await User.findOne({ email })) {
      return sendError(res, 400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { name, email, password: hashedPassword, role };

    if (role === "jobSeeker") userData.jobSeeker = {};
    // Only add company if companyName present
    if (role === "employer" && companyName) {
      userData.company = { name: companyName };
    }

    const user = new User(userData);
    await user.save();

    return sendSuccess(res, 201, "User registered", {
      userId: user.userId,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    // Optionally: If err.name==='ValidationError', attach err.message to details
    return sendError(res, 500, "Registration failed", err.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password)
      return sendError(res, 400, "Email & Password required");

    const user = await User.findOne({ email });
    if (!user) return sendError(res, 400, "User not found");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return sendError(res, 400, "Invalid credentials");

    if (role && user.role !== role) return sendError(res, 403, "Role mismatch");

    const accessToken = jwt.sign(
      { userId: user.userId, role: user.role, email: user.email },
      process.env.JWT_SECRET || "my-secret",
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET || "my-secret",
      { expiresIn: "7d" }
    );

    return sendSuccess(res, 200, "Login successful", {
      accessToken,
      refreshToken,
      user: {
        userId: user.userId ?? null,
        name: user.name ?? null,
        email: user.email ?? null,
        role: user.role ?? null,
        phone: user.phone ?? null,
        profileImage: user.profileImage ?? null,
        address: user.address ?? null,
        company: user.company ?? null,
        jobSeeker: user.jobSeeker ?? null,
        createdAt: user.createdAt ?? null,
        updatedAt: user.updatedAt ?? null,
      },
    });
  } catch (error) {
    return sendError(res, 500, "Login failed", error.message);
  }
};

exports.logoutUser = async (req, res) => {
  return sendSuccess(res, 200, "Logged out");
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== "admin") {
      return sendError(res, 403, "Access denied");
    }

    const user = await User.findOne({ userId });
    if (!user) return sendError(res, 404, "User not found");

    return sendSuccess(res, 200, "User fetched", user);
  } catch (err) {
    return sendError(res, 500, "Failed to fetch user", err.message);
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== "admin") {
      return sendError(res, 403, "Access denied");
    }

    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.email;

    if (updateData.jobSeeker) {
      updateData.jobSeeker.profileLastUpdated = new Date();
    }

    const updated = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) return sendError(res, 404, "User not found");

    return sendSuccess(res, 200, "Profile updated", updated);
  } catch (err) {
    return sendError(res, 500, "Failed to update profile", err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== "admin") {
      return sendError(res, 403, "Access denied");
    }

    const deletedUser = await User.findOneAndDelete({ userId });
    if (!deletedUser) return sendError(res, 404, "User not found");

    return sendSuccess(res, 200, "User deleted");
  } catch (err) {
    return sendError(res, 500, "Failed to delete user", err.message);
  }
};

exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return sendError(res, 403, "Only admin can access this");
    }

    const users = await User.find();
    return sendSuccess(res, 200, "User list fetched", users);
  } catch (err) {
    return sendError(res, 500, "Failed to fetch users", err.message);
  }
};
