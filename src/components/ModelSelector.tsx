import { Brain, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Model {
  id: string;
  name: string;
  description: string;
  icon: typeof Brain;
  color: string;
  provider: "openai" | "anthropic" | "google";
}

// All available models (used in Settings)
export const models: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "OpenAI",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    provider: "openai"
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "OpenAI",
    icon: Sparkles,
    color: "from-blue-600 to-cyan-600",
    provider: "openai"
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    provider: "anthropic"
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    description: "Anthropic",
    icon: MessageSquare,
    color: "from-purple-600 to-pink-600",
    provider: "anthropic"
  },
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    description: "Anthropic",
    icon: MessageSquare,
    color: "from-purple-400 to-pink-400",
    provider: "anthropic"
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "Google",
    icon: Brain,
    color: "from-orange-500 to-yellow-500",
    provider: "google"
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Google",
    icon: Brain,
    color: "from-orange-400 to-yellow-400",
    provider: "google"
  }
];

// Provider options for home page selector
interface Provider {
  id: "openai" | "anthropic" | "google";
  name: string;
  description: string;
  icon: typeof Brain;
  color: string;
}

const providers: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT Models",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "anthropic",
    name: "Claude",
    description: "Anthropic",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "google",
    name: "Gemini",
    description: "Google",
    icon: Brain,
    color: "from-orange-500 to-yellow-500"
  }
];

interface ModelSelectorProps {
  selectedProviders: ("openai" | "anthropic" | "google")[];
  onToggle: (provider: "openai" | "anthropic" | "google") => void;
}

export const ModelSelector = ({ selectedProviders, onToggle }: ModelSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground px-2">
        Select AI Providers
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isSelected = selectedProviders.includes(provider.id);
      
          return (
            <div key={provider.id} className="flex-shrink-0">
              <Label
                htmlFor={provider.id}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap",
                  "hover:scale-105 active:scale-95 border",
                  isSelected 
                    ? "bg-gradient-to-br " + provider.color + " border-transparent shadow-md text-white" 
                    : "bg-secondary/30 border-border hover:bg-secondary/50"
                )}
              >
                <Checkbox
                  id={provider.id}
                  checked={isSelected}
                  onCheckedChange={() => onToggle(provider.id)}
                  className={cn(
                    "border-2",
                    isSelected ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-primary" : "border-muted-foreground"
                  )}
                />
                <Icon className={cn("h-5 w-5", isSelected ? "text-white" : "text-primary")} />
                <div className="flex flex-col">
                  <span className={cn("text-sm font-semibold", isSelected ? "text-white" : "text-foreground")}>
                    {provider.name}
                  </span>
                  <span className={cn("text-xs", isSelected ? "text-white/80" : "text-muted-foreground")}>
                    {provider.description}
                  </span>
                </div>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
