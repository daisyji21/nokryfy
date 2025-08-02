const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/checkAdmin");

const {
  createUser, // Signup (public)
  loginUser, // Login (public)
  logoutUser, // Logout (protected)
  getUserById, // Get user profile (protected)
  updateUserProfile, // Update profile (protected)
  deleteUser, // Delete user (protected)
  listUsers, // List users (admin only)
} = require("../controllers/user.controller");

// === PUBLIC ROUTES ===
router.post("/signup", createUser); // Register
router.post("/login", loginUser); // Login

// === PROTECTED ROUTES (Auth required) ===
router.post("/logout", auth, logoutUser); // Logout (can be just token removal client-side)
router.get("/:userId", auth, getUserById); // Get user's own or (if admin) any profile
router.put("/:userId", auth, updateUserProfile); // Update user's own or admin can update
router.delete("/:userId", auth, deleteUser); // Delete own or admin delete

// === ADMIN ROUTES ===
router.get("/admin/list", listUsers); // Admin: list all users

module.exports = router;
