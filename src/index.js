import express from "express";
import cors from "cors";
import { env, validateEnv } from "./config/env.js";
import { connectToMongoDB, closeMongoDB } from "./config/db.js";
import userRoutes from "./routes/user/index.js";
import adminRoutes from "./routes/admin/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sendSuccess } from "./utils/apiResponse.js";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health / welcome routes
app.get("/", (req, res) => {
  return sendSuccess(
    res,
    { name: "Salon Book API", version: "1.0.0" },
    "Salon Book API is running"
  );
});

app.get("/api/health", (req, res) => {
  return sendSuccess(
    res,
    { status: "ok", uptime: process.uptime() },
    "Server is healthy"
  );
});

// Feature routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// 404 + error handling (must be registered last)
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    validateEnv();
    await connectToMongoDB();

    const server = app.listen(env.port, () => {
      console.log(
        `Salon Book server running on http://localhost:${env.port} (${env.nodeEnv})`
      );
    });

    // Close the server and the database connection on shutdown.
    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down...`);

      server.close(async () => {
        await closeMongoDB();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
