const express = require('express');
const router = express.Router();

const {
  createUser,     // signup
  loginUser,      // login
  getUsers,       // get all users
  getUserById,    // get user by ID
  updateUser,     // update user
  deleteUser,     // delete user
  listUsers       // admin list
} = require('../controllers/user.Controller');

//  Auth Routes
router.post('/signup', createUser);       // Register a new user
router.post('/login', loginUser);         // Login user

// 👤 User CRUD Routes
router.get('/', getUsers);                // Get all users
router.get('/:id', getUserById);          // Get single user by ID
router.put('/:id', updateUser);           // Update user by ID
router.delete('/:id', deleteUser);        // Delete user by ID

//  Admin-only Route
router.get('/admin/list', listUsers);     // List all users if admin

module.exports = router;


