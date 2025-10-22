import { Brain, Zap, Sparkles, MessageSquare } from "lucide-react";
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

const models: Model[] = [
  {
    id: "gpt-4",
    name: "ChatGPT",
    description: "GPT-4",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    provider: "openai"
  },
  {
    id: "claude-sonnet",
    name: "Claude",
    description: "Sonnet 3.5",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    provider: "anthropic"
  },
  {
    id: "gemini-pro",
    name: "Gemini",
    description: "Pro 1.5",
    icon: Brain,
    color: "from-orange-500 to-yellow-500",
    provider: "google"
  },
  {
    id: "custom",
    name: "Custom",
    description: "Your model",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    provider: "openai"
  }
];

interface ModelSelectorProps {
  selectedModels: string[];
  onToggle: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModels, onToggle }: ModelSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground px-2">
        Select AI Models
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {models.map((model) => {
          const Icon = model.icon;
          const isSelected = selectedModels.includes(model.id);
      
          return (
            <div key={model.id} className="flex-shrink-0">
              <Label
                htmlFor={model.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap",
                  "hover:scale-105 active:scale-95 border",
                  isSelected 
                    ? "bg-gradient-to-br " + model.color + " border-transparent shadow-md text-white" 
                    : "bg-secondary/30 border-border hover:bg-secondary/50"
                )}
              >
                <Checkbox
                  id={model.id}
                  checked={isSelected}
                  onCheckedChange={() => onToggle(model.id)}
                  className={cn(
                    "border-2",
                    isSelected ? "border-white data-[state=checked]:bg-white data-[state=checked]:text-primary" : "border-muted-foreground"
                  )}
                />
                <Icon className={cn("h-4 w-4", isSelected ? "text-white" : "text-primary")} />
                <div className="flex flex-col">
                  <span className={cn("text-xs font-semibold", isSelected ? "text-white" : "text-foreground")}>
                    {model.name}
                  </span>
                  <span className={cn("text-[10px]", isSelected ? "text-white/80" : "text-muted-foreground")}>
                    {model.description}
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

export { models };
