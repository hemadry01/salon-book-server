import { sendError } from "../utils/apiResponse.js";

// Runs when no route matched the request.
export function notFound(req, res) {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
