import { supabase } from "@/integrations/supabase/client";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ModelProvider = "openai" | "anthropic" | "google";

export interface ModelResponse {
  modelId: string;
  modelName: string;
  content?: string;
  error?: string;
}

const getApiKey = (provider: ModelProvider): string | null => {
  return localStorage.getItem(`${provider}_api_key`);
};

const callModel = async (
  provider: ModelProvider,
  modelId: string,
  messages: Message[]
): Promise<string> => {
  const apiKey = getApiKey(provider);
  
  if (!apiKey) {
    throw new Error(`Please add ${provider.toUpperCase()} API key in settings`);
  }

  const functionName = `chat-${provider}`;
  
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: { messages, apiKey, model: modelId },
  });

  if (error) throw error;
  if (data.error) throw new Error(data.error);
  
  return data.content;
};

export const callMultipleModels = async (
  selectedModels: Array<{ id: string; name: string; provider: ModelProvider }>,
  messages: Message[],
  onProgress: (provider: ModelProvider, result: ModelResponse) => void
): Promise<ModelResponse[]> => {
  const promises = selectedModels.map(async (model) => {
    try {
      console.log(`Calling ${model.provider} with model ${model.id}...`);
      const content = await callModel(model.provider, model.id, messages);
      const result: ModelResponse = {
        modelId: model.id,
        modelName: model.name,
        content,
      };
      console.log(`${model.provider} response received:`, content?.substring(0, 100));
      onProgress(model.provider, result);
      return result;
    } catch (error) {
      console.error(`${model.provider} error:`, error);
      const result: ModelResponse = {
        modelId: model.id,
        modelName: model.name,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      onProgress(model.provider, result);
      return result;
    }
  });

  return Promise.all(promises);
};

export const consolidateResponses = async (
  responses: ModelResponse[],
  consolidatorModel: { id: string; name: string; provider: ModelProvider }
): Promise<string> => {
  const successfulResponses = responses.filter((r) => r.content && !r.error);
  
  if (successfulResponses.length === 0) {
    throw new Error("No successful responses to consolidate");
  }

  const responsesText = successfulResponses
    .map((r) => `${r.modelName}:\n${r.content}`)
    .join("\n\n---\n\n");

  // Get custom consolidation template from localStorage
  const templateRaw = localStorage.getItem("consolidation_template");
  const template = templateRaw || `You are an expert AI tasked with merging multiple model responses into one clear, accurate, and coherent answer.

Review all answers below, resolve contradictions, and write the best unified response.

{responses}`;

  const userContent = template.replace("{responses}", responsesText);

  const consolidationPrompt: Message[] = [
    {
      role: "user",
      content: userContent,
    },
  ];

  return callModel(consolidatorModel.provider, consolidatorModel.id, consolidationPrompt);
};
