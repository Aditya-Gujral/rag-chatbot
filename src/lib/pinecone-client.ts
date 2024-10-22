import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";

// Declare the pineconeClientInstance variable at a higher scope
let pineconeClientInstance: Pinecone | null = null;

// Initialize Pinecone client and prepare the index for access
async function initPineconeClient(): Promise<Pinecone> {
  try {
    console.log('Initializing Pinecone Client...');

    // Initialize the Pinecone client with the API key and environment
    const pineconeClient = new Pinecone();
    await pineconeClient.init({
      apiKey: env.PINECONE_API_KEY as string,
      environment: env.PINECONE_ENVIRONMENT as string,
    });

    console.log('Pinecone Client Initialized');
    return pineconeClient;
  } catch (error) {
    console.error("Error initializing Pinecone client:", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

// Function to get the Pinecone client instance (Singleton pattern)
export async function getPineconeClient(): Promise<Pinecone> {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}
