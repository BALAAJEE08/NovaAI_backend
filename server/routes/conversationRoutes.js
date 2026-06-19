import express from "express";
import {
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  updateConversation
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listConversations).post(createConversation);
router.route("/:id").get(getConversation).put(updateConversation).delete(deleteConversation);

export default router;
