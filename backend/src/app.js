import cors from "cors";
import express from "express";
import morgan from "morgan";

import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { router } from "./routes/index.js";
import { seedDatabase } from "./scripts/seedRuntime.js";

export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "backend",
    status: "ok"
  });
});

app.use("/api", router);
app.use(notFound);
app.use(errorHandler);

export async function startServer() {
  await connectDb();

  if (env.autoSeed) {
    await seedDatabase({ force: false });
  }

  return app.listen(env.port, () => {
    console.log(`${env.appName} backend listening on port ${env.port}`);
  });
}

