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

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
//role match ?
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

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update User
// const updateUser = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

//     res.json({ success: true, message: "User updated successfully", data: updatedUser });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };


// Update User Profile Controller (email can't be updated)
// const updateUserProfile = async (req, res) => {
//   try {
//        const userIdParam = req.params.userId;
//     const updateData = { ...req.body };

//     // Prevent email from being updated
//     if (updateData.email) {
//       delete updateData.email;
//     }

//     // Update profileLastUpdated.updateAt timestamp
//     updateData['profileLastUpdated.updateAt'] = new Date();

//     // Find user and update
//     const updatedUser = await User.findByIdAndUpdate(
// { userId: userIdParam },
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

// //     //remove password from response
//  const userObj = updatedUser.toJSON();
// //     delete userObj.password;
//     return res.status(200).json({success:true,
//       message: "User profile updated successfully",
       
//         user: updatedUser.toJSON()
      

      
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };
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
  getUsers,
  getUserById,
 updateUserProfile ,
  deleteUser,
  listUsers,
  logoutUser
};