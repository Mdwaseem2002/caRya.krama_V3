// ─────────────────────────────────────────────────────────────────────────────
// src/lib/mongodb.ts
// Singleton MongoDB connection with connection caching for Next.js.
// Prevents creating new connections on every hot-reload in development.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// Global cache for Mongoose to avoid multiple connections in development
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

/** 
 * Connects to MongoDB with error handling and connection pooling.
 * Checks the readyState to ensure we don't try to reconnect if already active.
 */
export async function connectDB(): Promise<Mongoose> {
  // 1. Check if we are already connected (readyState: 1 = connected)
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // 2. Check if we are currently connecting (readyState: 2 = connecting)
  if (mongoose.connection.readyState === 2) {
    console.log("⏳ MongoDB is already connecting, waiting for promise...");
    if (cached.promise) return cached.promise;
  }

  // 3. Initiate connection if no promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 20000, // Increased to 20s for more stability
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to avoid some DNS resolution issues in serverless
    };

    console.log("🔄 Initiating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ MongoDB Connected Successfully to:", m.connection.db?.databaseName || "default");
      return m;
    }).catch((err) => {
      console.error("❌ MongoDB Connection Promise Error:", err);
      cached.promise = null; // Reset so next request can retry
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error("❌ MongoDB Final Connection Error:", e);
    throw e;
  }
}

export default connectDB;
