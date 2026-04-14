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

// Extend the NodeJS global type to cache the connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// In development, Next.js hot-reloads modules; use global cache to avoid
// re-opening connections every time.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB(): Promise<Mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,     // Fail fast if disconnected, don't queue ops
      maxPoolSize: 10,           // Max concurrent connections in the pool
      minPoolSize: 2,            // Keep 2 connections warm at all times
      serverSelectionTimeoutMS: 5000,  // Fail fast after 5s (was 10s)
      connectTimeoutMS: 10000,   // Initial TCP connect timeout
      socketTimeoutMS: 45000,    // Close sockets after 45s of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset so retries work
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
