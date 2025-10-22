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
    name: "GPT-4",
    description: "Deep reasoning",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    provider: "openai"
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    description: "Balanced & smart",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    provider: "anthropic"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Most capable",
    icon: Brain,
    color: "from-orange-500 to-yellow-500",
    provider: "google"
  }
];

interface ModelSelectorProps {
  selectedModels: string[];
  onToggle: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModels, onToggle }: ModelSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-4">
          Select AI Models (Choose Multiple)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 glass-card rounded-xl">
          {models.map((model) => {
            const Icon = model.icon;
            const isSelected = selectedModels.includes(model.id);
        
            return (
              <div key={model.id} className="relative">
                <Label
                  htmlFor={model.id}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg transition-all cursor-pointer",
                    "hover:scale-105 active:scale-95",
                    isSelected 
                      ? "bg-gradient-to-br " + model.color + " shadow-lg glow-effect" 
                      : "bg-secondary/50 hover:bg-secondary"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Checkbox
                      id={model.id}
                      checked={isSelected}
                      onCheckedChange={() => onToggle(model.id)}
                      className={cn(
                        "border-2",
                        isSelected ? "border-white" : "border-primary"
                      )}
                    />
                  </div>
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isSelected ? "bg-white/20" : "bg-primary/10"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      isSelected ? "text-white" : "text-primary"
                    )} />
                  </div>
                  <div className="text-center">
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
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { models };
