import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  appName: process.env.APP_NAME || "BlinkShield AI",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "blinkshield-super-secret",
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blinkshield",
  aiEngineUrl: process.env.AI_ENGINE_URL || "http://127.0.0.1:8000",
  mockMode: (process.env.MOCK_MODE || "true").toLowerCase() === "true",
  autoSeed: (process.env.AUTO_SEED || "false").toLowerCase() === "true"
};

