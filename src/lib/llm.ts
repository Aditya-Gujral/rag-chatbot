import { ChatOpenAI } from "@langchain/openai";

export const streamingModel= new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  streaming: true,
  temperature: 0,
});

export const nonStreamingModel= new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

