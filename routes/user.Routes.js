const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const {
  createUser,     // signup
  loginUser,      // login
  getUsers,       // get all users
  getUserById,    // get user by ID
 updateUserProfile,     // update user
  deleteUser,     // delete user
  listUsers, // admin list
logoutUser
} = require('../controllers/user.Controller');

//  Auth Routes
router.post('/signup', createUser);       // Register a new user
router.post('/login', loginUser);// Login user
router.post('/logout',auth, logoutUser)

// 👤 User CRUD Routes
router.get('/',auth,  getUsers);                // Get all users
router.get('/:userId',auth, getUserById);          // Get single user by ID
router.put('/:userId',auth, updateUserProfile);           // Update user by ID
router.delete('/:userId',auth, deleteUser);        // Delete user by ID

//  Admin-only Route
router.get('/admin/list', listUsers);     // List all users if admin

module.exports = router;


