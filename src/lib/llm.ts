import {
  BaseLanguageModel,
  BaseLanguageModelInterface,
  BaseLanguageModelInput,
} from "@langchain/core/language_models/base;

const streamingModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  streaming: true,
  temperature: 0,
}) as BaseLanguageModel;

const nonStreamingModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
}) as BaseLanguageModel;
