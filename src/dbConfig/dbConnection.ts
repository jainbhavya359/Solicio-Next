import mongoose from "mongoose";
import { setupDbTelemetry } from "@/src/lib/telemetry/dbTelemetry";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not defined");
}

setupDbTelemetry();

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // IMPORTANT
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
