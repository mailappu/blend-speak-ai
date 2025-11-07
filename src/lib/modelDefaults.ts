export const DEFAULT_MODELS = {
  openai: "gpt-4o",
  anthropic: "claude-sonnet-4-5",
  google: "gemini-1.5-pro",
};

export const getConfiguredModel = (provider: "openai" | "anthropic" | "google"): string => {
  const stored = localStorage.getItem(`${provider}_selected_model`);
  return stored || DEFAULT_MODELS[provider];
};

export const setConfiguredModel = (provider: "openai" | "anthropic" | "google", modelId: string): void => {
  localStorage.setItem(`${provider}_selected_model`, modelId);
};

export const getCustomModel = (provider: "openai" | "anthropic" | "google"): string | null => {
  return localStorage.getItem(`${provider}_custom_model`);
};

export const setCustomModel = (provider: "openai" | "anthropic" | "google", modelId: string): void => {
  if (modelId.trim()) {
    localStorage.setItem(`${provider}_custom_model`, modelId);
  } else {
    localStorage.removeItem(`${provider}_custom_model`);
  }
};

export const getConsolidationTemplate = (): string => {
  const stored = localStorage.getItem("consolidation_template");
  return stored || `You are an expert AI tasked with merging multiple model responses into one clear, accurate, and coherent answer.

Review all answers below, resolve contradictions, and write the best unified response.

{responses}`;
};

export const setConsolidationTemplate = (template: string): void => {
  localStorage.setItem("consolidation_template", template);
};

export const resetConsolidationTemplate = (): void => {
  localStorage.removeItem("consolidation_template");
};
