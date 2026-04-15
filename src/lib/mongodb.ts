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

  // 2. Return cached instance if available
  if (cached.conn) {
    return cached.conn;
  }

  // 3. Initiate connection if no promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,      // Queue commands while connecting (prevents "App Error" crash)
      maxPoolSize: 10,           // Max concurrent connections
      minPoolSize: 2,            // Keep 2 connections warm
      serverSelectionTimeoutMS: 10000, // Wait 10s for DB to wake up (Standard in serverless)
      connectTimeoutMS: 15000,   // Initial TCP connect timeout
      socketTimeoutMS: 45000,    // Time before closing quiet sockets
    };

    console.log("🔄 Initiating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ MongoDB Connected Successfully");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear promise so retries can happen
    console.error("❌ MongoDB Connection Error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
