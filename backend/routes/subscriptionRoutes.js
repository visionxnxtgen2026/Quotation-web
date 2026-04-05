import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// @desc    Update user subscription plan
// @route   POST /api/subscription/update
router.post("/update", protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.plan = plan;
      // Pro பிளான் எடுத்தா isSubscribed-ஐ true ஆக்குறோம்
      user.isSubscribed = (plan === "pro");
      
      const updatedUser = await user.save();
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;