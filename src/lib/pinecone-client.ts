import Pinecone from "@pinecone-database/pinecone";
import { env } from "./config";



// Initialize index and ready to be accessed.
export async function getPineconeClient() {
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

