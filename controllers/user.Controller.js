const User = require('../models/users'); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create User (Signup)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//      Login User
const loginUser = async (req, res) => {
  try {
    const { email, password,role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
//role match 
  
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied: '${role}' role expected, but found '${user.role}'`
      });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Userprofile by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// // USER PROFILE
// const getUserProfile = async (req, res) => { 
//   try {
//     const user = await User.findOne({ userId: req.user.userId });
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = { ...req.body };

    // Prevent email from being updated
    if (updateData.email) {
      delete updateData.email;
    }

    // Update profileLastUpdated.updateAt timestamp
    updateData['profileLastUpdated.updateAt'] = new Date();

    // Find user by userId (UUID) and update
    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },        // Querying by userId (UUID)
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = updatedUser.toObject();
    delete userObj.password;
    delete userObj._id;  // 
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: userObj
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
// COMPANY PROFILE
const getCompanyProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId, role: 'employer' });
    if (!user) return res.status(404).json({ message: 'Employer not found' });
    res.status(200).json({ success: true, company: user.employer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete User
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// List Users (Only if Admin)
const listUsers = async (req, res) => {
  const isAdmin = req.query.admin === "true";
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }

  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// logout

const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await Token.deleteOne({ token });
    res.clearCookie("refreshToken");
  }
 
  res.status(200).json({
    success: true,
    code: 200,
    message: "Logged out successfully",
  });
};

module.exports = {
  createUser,
  loginUser,
  //getUsers,
  getUserById,
  // getUserProfile,
  getCompanyProfile,
 updateUserProfile ,
  deleteUser,
  listUsers,
  logoutUser
};