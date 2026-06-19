import express from "express";
import { changePassword, deleteAccount, exportHistory, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/password", protect, validate({ currentPassword: { required: true }, newPassword: { required: true } }), changePassword);
router.get("/export", protect, exportHistory);
router.delete("/account", protect, deleteAccount);

export default router;
