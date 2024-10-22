import { PineconeClient } from '@pinecone-database/pinecone';
import { error } from 'console';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  try {
    // Initialize the Pinecone client
    const pc = new PineconeClient();

    // Initialize the client with the API key from environment variables
    //await pc.init({
      //apiKey: process.env.PINECONE_API_KEY,
    //});
    pc.init({apiKey: process.env.PINECONE_API_KEY, environment: process.env.PINECONE_ENVIRONMENT,});
    // Get the index name from environment variables
    const indexName = process.env.PINECONE_INDEX_NAME;
    const index = pc.Index(indexName);
} catch(error){
    console.log("error",error)
}
}

main();
