const trialHistorySchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  hasUsedTrial: { type: Boolean, default: true },
  lastUsedDate: { type: Date, default: Date.now }
});