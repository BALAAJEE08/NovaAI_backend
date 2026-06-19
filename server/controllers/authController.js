import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const userPayload = (user) => ({ id: user._id, name: user.name, email: user.email, avatar: user.avatar, settings: user.settings });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;
  if (await User.findOne({ email })) throw new ApiError(409, "Email is already registered.");
  const user = await User.create({ name, email, password, avatar });
  res.status(201).json({ token: signToken(user._id), user: userPayload(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, "Invalid email or password.");
  res.json({ token: signToken(user._id), user: userPayload(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: userPayload(req.user) });
});
