import {
  BaseLanguageModel,
  BaseLanguageModelInterface,
  BaseLanguageModelInput,
} from "@langchain/core/language_models/base"; // Closing quote added here

import { ChatOpenAI } from "@langchain/openai";

const streamingModel: BaseLanguageModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  streaming: true,
  temperature: 0,
});

const nonStreamingModel: BaseLanguageModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

