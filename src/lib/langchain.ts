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

let pineconeClientInstance;

async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await createPineconeClient(); // Your client creation logic
  }
  return pineconeClientInstance;
}

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const pineconeClient = await getPineconeClient();
    const vectorStore = await getVectorStore(pineconeClient);

    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();
    
    const retriever = vectorStore.asRetriever({ k: 3 }); // Limit results

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel as any,
      retriever as any,
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel as any,
        },
      }
    );

    const res = await chain.call(
      { question: sanitizedQuestion, chat_history: chatHistory },
      [handlers]
    );

    const sourceDocuments = res?.sourceDocuments || [];
    const firstTwoDocuments = sourceDocuments.slice(0, 2);
    const pageContents = firstTwoDocuments.map(
      (doc: { pageContent: string }) => doc.pageContent || "No content"
    );

    data.append({ sources: pageContents });
    data.close();

    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error("Error in callChain:", e);
    throw new Error("Call chain method failed to execute successfully!");
  }
}

