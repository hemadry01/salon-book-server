import "dotenv/config";

// All environment variables are read here, so the rest of the app
// never has to touch process.env directly.
export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  dbUrl: process.env.DB_URL,
  dbName: process.env.DB_NAME || "salon-book",
};

export function validateEnv() {
  const missing = [];

  if (!env.dbUrl) {
    missing.push("DB_URL");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Create a .env file (see .env.example for the required values)."
    );
  }
}
