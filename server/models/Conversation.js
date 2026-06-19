import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, default: "New Chat" },
    mode: {
      type: String,
      enum: ["general", "coding", "bug-fix", "writing", "resume", "interview", "career"],
      default: "general"
    },
    isArchived: { type: Boolean, default: false, index: true },
    isFavorite: { type: Boolean, default: false, index: true },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

conversationSchema.index({ title: "text" });

export default mongoose.model("Conversation", conversationSchema);
