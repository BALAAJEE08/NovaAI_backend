import express from "express";
import { listMessages, regenerateMessage, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/:conversationId", protect, listMessages);
router.post("/:conversationId", protect, validate({ content: { required: true } }), sendMessage);
router.post("/:conversationId/regenerate", protect, regenerateMessage);

export default router;
