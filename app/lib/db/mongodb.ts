import mongoose from 'mongoose';

let isConnected = false;

export async function connectToMongoDB(context?: any) {
  if (isConnected) {
    return;
  }

  try {
    // Try to get MongoDB URI from multiple sources
    const mongoUri =
      process.env.MONGODB_URI ||
      import.meta.env.MONGODB_URI ||
      (context?.cloudflare?.env as any)?.MONGODB_URI ||
      (context?.env as any)?.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectFromMongoDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  }
}

export function isMongoDBAvailable(context?: any): boolean {
  const mongoUri =
    process.env.MONGODB_URI ||
    import.meta.env.MONGODB_URI ||
    (context?.cloudflare?.env as any)?.MONGODB_URI ||
    (context?.env as any)?.MONGODB_URI;

  return !!mongoUri;
}

export { mongoose };
