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
import { BaseLanguageModel } from "langchain-core/src/language_models/base"; // Correct import path

type callChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const pineconeClient = await getPineconeClient();
    const vectorStore = await getVectorStore(pineconeClient);

    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();

    // Properly cast models to BaseLanguageModel
    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel as BaseLanguageModel,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel as BaseLanguageModel,
        },
      }
    );

    try {
      const res = await chain.call(
        { question: sanitizedQuestion, chat_history: chatHistory },
        [handlers]
      );

      const sourceDocuments = res?.sourceDocuments || [];
      const firstTwoDocuments = sourceDocuments.slice(0, 2);
      const pageContents = firstTwoDocuments.map(
        ({ pageContent }: { pageContent: string }) => pageContent
      );

      console.log("Already appended: ", data);
      data.append({ sources: pageContents });
      data.close();
    } catch (error) {
      console.error("Error during chain call:", error);
      throw new Error("Failed to retrieve data from the chain!");
    }

    // Return the readable stream
    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error("Error in callChain:", e);
    throw new Error("Call chain method failed to execute successfully!");
  }
}
