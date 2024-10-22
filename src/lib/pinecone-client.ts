import { Pinecone } from "@pinecone-database/pinecone"; // Import as a named export
import { env } from "./config";

// Initialize and return the Pinecone client
export async function getPineconeClient() {
  try {
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
    return pineconeClient;
  } catch (error) {
    console.error("Error initializing Pinecone Client:", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}


