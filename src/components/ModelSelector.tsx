import { Brain, Zap, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Model {
  id: string;
  name: string;
  description: string;
  icon: typeof Brain;
  color: string;
}

const models: Model[] = [
  {
    id: "gpt4",
    name: "GPT-4",
    description: "Most capable model",
    icon: Brain,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "claude",
    name: "Claude",
    description: "Deep reasoning",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Fast & efficient",
    icon: Zap,
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: "custom",
    name: "Custom",
    description: "Your fine-tuned model",
    icon: Trophy,
    color: "from-green-500 to-emerald-500"
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModel, onSelect }: ModelSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 glass-card rounded-xl">
      {models.map((model) => {
        const Icon = model.icon;
        const isSelected = selectedModel === model.id;
        
        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={cn(
              "relative p-4 rounded-lg transition-all group",
              "hover:scale-105 active:scale-95",
              isSelected 
                ? "bg-gradient-to-br " + model.color + " shadow-lg glow-effect" 
                : "bg-secondary/50 hover:bg-secondary"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isSelected ? "bg-white/20" : "bg-primary/10 group-hover:bg-primary/20"
              )}>
                <Icon className={cn(
                  "h-5 w-5",
                  isSelected ? "text-white" : "text-primary"
                )} />
              </div>
              <div>
                <p className={cn(
                  "text-sm font-semibold",
                  isSelected ? "text-white" : "text-foreground"
                )}>
                  {model.name}
                </p>
                <p className={cn(
                  "text-xs",
                  isSelected ? "text-white/80" : "text-muted-foreground"
                )}>
                  {model.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
