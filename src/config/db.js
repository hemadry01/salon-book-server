import { MongoClient } from "mongodb";
import { env } from "./env.js";

let client = null;
let database = null;

// Connects once and reuses the same connection for the whole app.
export async function connectToMongoDB() {
  if (database) {
    return database;
  }

  client = new MongoClient(env.dbUrl);
  await client.connect();

  database = client.db(env.dbName);
  console.log(`Connected to MongoDB database "${env.dbName}"`);

  return database;
}

export function getDatabase() {
  if (!database) {
    throw new Error("MongoDB is not connected yet. Call connectToMongoDB() first.");
  }

  return database;
}

// Small helper so routes can simply do getCollection("services").
export function getCollection(name) {
  return getDatabase().collection(name);
}

export async function closeMongoDB() {
  if (!client) {
    return;
  }

  await client.close();
  client = null;
  database = null;
  console.log("MongoDB connection closed");
}
