import User from "../models/User.js";

// ==============================
// 🧑‍💻 GET ALL USERS (Admin/Utility)
// ==============================
// @desc    Get list of all users
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================
// 🧑‍💻 GET CURRENT USER PROFILE
// ==============================
// @desc    Get logged-in user profile data
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // req.user._id is set by your Auth Middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================
// 📝 UPDATE USER PROFILE
// ==============================
// @desc    Update profile fields (Matches your React Form)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update basic info
    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;

    // These fields allow empty strings if the user clears the input
    user.designation = req.body.designation !== undefined ? req.body.designation : user.designation;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    // Handle Profile Picture (if using Multer middleware in routes)
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      user.profilePic = `${baseUrl}/uploads/${req.file.filename}`;
    }

    // Save and trigger Mongoose middleware
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully! 🎉",
      user: updatedUser,
    });

  } catch (err) {
    console.error("Update Profile Error:", err.message);
    
    // Handle Mongoose Validation Errors (e.g. invalid mobile format)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    res.status(500).json({ 
      success: false, 
      message: "An error occurred while updating your profile." 
    });
  }
};

// ==============================
// 🗑️ DELETE USER ACCOUNT
// ==============================
// @desc    Delete logged-in user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      await User.findByIdAndDelete(req.user._id);
      res.status(200).json({ success: true, message: "User account deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
