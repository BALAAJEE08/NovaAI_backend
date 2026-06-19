import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const payload = (user) => ({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, settings: user.settings });

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.avatar !== undefined) updates.avatar = req.body.avatar;
  if (req.body.settings !== undefined) updates.settings = req.body.settings;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ user: payload(user) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) throw new ApiError(401, "Current password is incorrect.");
  user.password = req.body.newPassword;
  await user.save();
  res.json({ message: "Password changed." });
});

export const exportHistory = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ userId: req.user._id }).sort({ createdAt: 1 });
  const messages = await Message.find({ conversationId: { $in: conversations.map((item) => item._id) } }).sort({ createdAt: 1 });
  res.json({ exportedAt: new Date().toISOString(), user: payload(req.user), conversations, messages });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const conversationIds = await Conversation.find({ userId: req.user._id }).distinct("_id");
  await Message.deleteMany({ conversationId: { $in: conversationIds } });
  await Conversation.deleteMany({ userId: req.user._id });
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: "Account deleted." });
});
