import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";

// Declare the pineconeClientInstance variable at a higher scope
let pineconeClientInstance: Pinecone | null = null; // Declare the type

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
    return pineconeClient;
  } catch (error) {
    console.error("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}

