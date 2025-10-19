import { Brain, Zap, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  selectedModels: string[];
  onSelect: (modelIds: string[]) => void;
  consolidatorModel: string;
  onConsolidatorChange: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModels, onSelect, consolidatorModel, onConsolidatorChange }: ModelSelectorProps) => {
  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelect(selectedModels.filter(id => id !== modelId));
    } else {
      onSelect([...selectedModels, modelId]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-4">
          Select Models to Query (multiple)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 glass-card rounded-xl">
          {models.map((model) => {
            const Icon = model.icon;
            const isSelected = selectedModels.includes(model.id);
        
            return (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
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
      </div>

      <div className="px-4 pb-4">
        <Label htmlFor="consolidator" className="text-sm font-semibold text-muted-foreground mb-2 block">
          Consolidator Model (combines responses)
        </Label>
        <Select value={consolidatorModel} onValueChange={onConsolidatorChange}>
          <SelectTrigger id="consolidator" className="glass-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center gap-2">
                  <model.icon className="h-4 w-4" />
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">- {model.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
