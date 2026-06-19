import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { generateAIResponse } from "../services/geminiService.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const loadConversation = async (req) => {
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    userId: req.user._id
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found.");
  }

  return conversation;
};

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await loadConversation(req);

  const userMessage = await Message.create({
    conversationId: conversation._id,
    role: "user",
    content: req.body.content
  });

  const history = await Message.find({
    conversationId: conversation._id
  }).sort({ createdAt: 1 });

  const aiContent = await generateAIResponse({
    prompt: req.body.content,
    mode: conversation.mode,
    history
  });

  console.log("=================================");
  console.log("USER PROMPT:", req.body.content);
  console.log("AI RESPONSE:", aiContent);
  console.log("=================================");

  const assistantMessage = await Message.create({
    conversationId: conversation._id,
    role: "assistant",
    content: aiContent
  });

  conversation.lastMessageAt = new Date();

  if (conversation.title === "New Chat") {
    conversation.title = req.body.content.slice(0, 48);
  }

  await conversation.save();

  res.status(201).json({
    userMessage,
    assistantMessage,
    conversation
  });
});

export const listMessages = asyncHandler(async (req, res) => {
  const conversation = await loadConversation(req);

  const messages = await Message.find({
    conversationId: conversation._id
  }).sort({ createdAt: 1 });

  res.json(messages);
});

export const regenerateMessage = asyncHandler(async (req, res) => {
  const conversation = await loadConversation(req);

  const messages = await Message.find({
    conversationId: conversation._id
  }).sort({ createdAt: 1 });

  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserMessage) {
    throw new ApiError(
      400,
      "No user message found to regenerate."
    );
  }

  const aiContent = await generateAIResponse({
    prompt: lastUserMessage.content,
    mode: conversation.mode,
    history: messages
  });

  console.log("=================================");
  console.log("REGENERATE PROMPT:", lastUserMessage.content);
  console.log("AI RESPONSE:", aiContent);
  console.log("=================================");

  const assistantMessage = await Message.create({
    conversationId: conversation._id,
    role: "assistant",
    content: aiContent
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  res.status(201).json(assistantMessage);
});