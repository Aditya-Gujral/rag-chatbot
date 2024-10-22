import Pinecone from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";

// Declare the pineconeClientInstance variable at a higher scope
let pineconeClientInstance: null;

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    console.log('#');
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
    const indexName = env.PINECONE_INDEX_NAME;
    console.log('#');
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
