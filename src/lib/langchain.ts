import { ConversationalRetrievalQAChain } from "langchain/chains";
import { getVectorStore } from "./vector-store";
import { getPineconeClient } from "./pinecone-client";
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from "ai-stream-experimental";
import { streamingModel, nonStreamingModel } from "./llm";
import { STANDALONE_QUESTION_TEMPLATE, QA_TEMPLATE } from "./prompt-templates";

type callChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    // Sanitize the input question
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    
    // Initialize Pinecone client and vector store
    const pineconeClient = await getPineconeClient();
    const vectorStore = await getVectorStore(pineconeClient);

    // Setup LangChain stream and data
    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();

    // Create the retriever from the vector store
    const retriever = vectorStore.asRetriever(); // Use top-k results

    // Initialize the conversational retrieval QA chain
    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,  // Ensure this is a valid model instance
      retriever,
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,  // Ensure non-streaming model is properly configured
        },
      }
    );

    try {
      // Call the retrieval chain
      const res = await chain.call(
        { question: sanitizedQuestion, chat_history: chatHistory },
        [handlers]  // Stream the response if necessary
      );

      // Extract source documents and append their content
      const sourceDocuments = res?.sourceDocuments || [];
      const firstTwoDocuments = sourceDocuments.slice(0, 2);
      const pageContents = firstTwoDocuments.map(
        (doc: { pageContent: string }) => doc.pageContent || "No content"
      );

      console.log("Already appended: ", data);
      data.append({ sources: pageContents });
      data.close();
    } catch (error) {
      console.error("Error during chain call:", error);
      throw new Error("Failed to retrieve data from the chain!");
    }

    // Return the streaming text response
    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error("Error in callChain:", e);
    throw new Error("Call chain method failed to execute successfully!");
  }
}


