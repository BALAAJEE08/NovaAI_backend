import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import cors from "cors"
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Debug Logs
console.log("=================================");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("=================================");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nova-ai-frontend-pearl.vercel.app",
    ],
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 800
  })
);

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan(
    process.env.NODE_ENV === "production"
      ? "combined"
      : "dev"
  )
);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "Nova AI API",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Nova AI API",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Nova AI API running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });