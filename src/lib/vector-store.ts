import { env } from './config';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import Pinecone from '@pinecone-database/pinecone';

const pc = new Pinecone();

export async function embedAndStoreDocs(
  docs: Document<Record<string, any>>[]
) {
  try {
    const embeddings = new OpenAIEmbeddings();
    
    // Initialize the Pinecone client with API key and environment
    await pc.init({
      apiKey: env.PINECONE_API_KEY as string,
      environment: env.PINECONE_ENVIRONMENT as string,
    });

    const index = pc.Index(env.PINECONE_INDEX_NAME as string) as unknown as Index<RecordMetadata>;

    // Embed the PDF documents and store in the vector store
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to load your docs!');
  }
}
