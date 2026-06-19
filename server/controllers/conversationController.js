import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ownerFilter = (req, extra = {}) => ({ userId: req.user._id, ...extra });

export const createConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.create({
    userId: req.user._id,
    title: req.body.title || "New Chat",
    mode: req.body.mode || "general"
  });
  res.status(201).json(conversation);
});

export const listConversations = asyncHandler(async (req, res) => {
  const filter = ownerFilter(req);
  if (req.query.archived === "true") filter.isArchived = true;
  if (req.query.archived === "false") filter.isArchived = false;
  if (req.query.favorite === "true") filter.isFavorite = true;
  if (req.query.search) filter.title = new RegExp(req.query.search, "i");
  const conversations = await Conversation.find(filter).sort({ lastMessageAt: -1, updatedAt: -1 });
  res.json(conversations);
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne(ownerFilter(req, { _id: req.params.id }));
  if (!conversation) throw new ApiError(404, "Conversation not found.");
  const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
  res.json({ conversation, messages });
});

export const updateConversation = asyncHandler(async (req, res) => {
  const allowed = ["title", "mode", "isArchived", "isFavorite"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const conversation = await Conversation.findOneAndUpdate(ownerFilter(req, { _id: req.params.id }), updates, {
    new: true,
    runValidators: true
  });
  if (!conversation) throw new ApiError(404, "Conversation not found.");
  res.json(conversation);
});

export const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOneAndDelete(ownerFilter(req, { _id: req.params.id }));
  if (!conversation) throw new ApiError(404, "Conversation not found.");
  await Message.deleteMany({ conversationId: conversation._id });
  res.json({ message: "Conversation deleted." });
});
