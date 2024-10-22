import {
  BaseLanguageModel,
  BaseLanguageModelInterface,
  BaseLanguageModelInput,
} from "@langchain/core/language_models/base";

import { ChatOpenAI } from "@langchain/openai";

export const streamingModel: BaseLanguageModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  streaming: true,
  temperature: 0,
});

export const nonStreamingModel: BaseLanguageModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

