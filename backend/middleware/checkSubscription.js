import User from "../models/User.js";

const checkSubscription = async (req, res, next) => {
  try {
    // protect middleware-ல் இருந்து வரும் User ID
    const userId = req.user._id || req.user.id;

    // டேட்டாபேஸ்ல இருந்து யூசரின் லேட்டஸ்ட் டேட்டாவை எடுக்கிறோம்
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // 1. யூசர் ஏற்கனவே காசு கட்டி Pro பிளான் (isSubscribed: true) வாங்கிட்டாரான்னு செக் பண்றோம்.
    // வாங்கியிருந்தா, எந்த தடையுமில்லாம உள்ளே விடலாம் (next)
    if (user.isSubscribed) {
      return next();
    }

    // 2. இல்லன்னா, அவரோட Trial Date முடிஞ்சிருச்சான்னு செக் பண்றோம்
    const currentDate = new Date();
    const trialExpiryDate = new Date(user.trialExpiresAt);

    if (currentDate > trialExpiryDate) {
      // ட்ரையல் முடிஞ்சிருச்சு! 403 Forbidden எரர் அனுப்புறோம்.
      // frontend-ல் "TRIAL_EXPIRED" வச்சு Subscription பேஜுக்கு Redirect பண்ணுவோம்.
      return res.status(403).json({
        success: false,
        message: "Your free trial has expired. Please upgrade to Pro to continue. ⚠️",
        code: "TRIAL_EXPIRED" 
      });
    }

    // 3. ட்ரையல் இன்னும் முடியலன்னா, உள்ளே விடலாம் (next)
    next();

  } catch (error) {
    console.error("Subscription Check Error:", error.message);
    res.status(500).json({ success: false, message: "Server error while checking subscription." });
  }
};

export default checkSubscription;