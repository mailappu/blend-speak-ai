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
  onProgress: (modelId: string, result: ModelResponse) => void
): Promise<ModelResponse[]> => {
  const promises = selectedModels.map(async (model) => {
    try {
      const content = await callModel(model.provider, model.id, messages);
      const result: ModelResponse = {
        modelId: model.id,
        modelName: model.name,
        content,
      };
      onProgress(model.id, result);
      return result;
    } catch (error) {
      const result: ModelResponse = {
        modelId: model.id,
        modelName: model.name,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      onProgress(model.id, result);
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

  const consolidationPrompt: Message[] = [
    {
      role: "system",
      content: "You are a helpful assistant that consolidates multiple AI responses into a single coherent summary.",
    },
    {
      role: "user",
      content: `Please summarize and consolidate these responses from different AI models:\n\n${responsesText}`,
    },
  ];

  return callModel(consolidatorModel.provider, consolidatorModel.id, consolidationPrompt);
};
