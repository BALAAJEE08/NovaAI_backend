import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboardStats = asyncHandler(async (req, res) => {
  const [conversations, totalMessages] = await Promise.all([
    Conversation.find({ userId: req.user._id }).sort({ lastMessageAt: -1 }),
    Message.countDocuments({
      conversationId: { $in: await Conversation.find({ userId: req.user._id }).distinct("_id") }
    })
  ]);

  res.json({
    totalChats: conversations.length,
    totalMessages,
    favoriteChats: conversations.filter((item) => item.isFavorite).length,
    archivedChats: conversations.filter((item) => item.isArchived).length,
    recentConversations: conversations.slice(0, 6)
  });
});
