import { env } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";

// Express recognizes an error handler by its four arguments.
export function errorHandler(error, req, res, next) {
  // Malformed JSON body from express.json()
  if (error.type === "entity.parse.failed") {
    return sendError(res, "Invalid JSON in request body", 400);
  }

  const statusCode = error.statusCode || error.status || 500;

  console.error(`[${req.method} ${req.originalUrl}]`, error);

  const message =
    statusCode === 500 ? "Internal server error" : error.message || "Request failed";

  const details =
    env.nodeEnv === "development" && statusCode === 500 ? error.message : null;

  return sendError(res, message, statusCode, details);
}
