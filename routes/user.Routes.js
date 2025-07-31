const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin')

const {
  createUser,     // signup
  loginUser,      // login
 // getUsers,       // get all users
  getUserById,    // get user by ID
  // getUserProfile, //user profile
 updateUserProfile,     // update user
  deleteUser,     // delete user
  listUsers, // admin list
logoutUser,
getCompanyProfile
} = require('../controllers/user.Controller');

//  Auth Routes
router.post('/signup', createUser);       // Register a new user
router.post('/login', loginUser);// Login user
router.post('/logout',auth, logoutUser)

// User CRUD Routes
// router.get('/',auth,  getUsers);                // Get all users
router.get('/:userId', getUserById);          // Get single user by ID
// router.get('/profile', auth, getUserProfile);
router.put('/:userId', updateUserProfile);  
router.get('/company', getCompanyProfile);        // Update user by ID
router.delete('/:userId', deleteUser);   //auth and admin    // Delete user by ID

//  Admin-only Route
router.get('/admin/list',listUsers);     //  List all users if admin 

module.exports = router;


