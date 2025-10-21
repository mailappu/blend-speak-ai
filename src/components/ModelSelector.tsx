import { Brain, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Model {
  id: string;
  name: string;
  description: string;
  icon: typeof Brain;
  color: string;
  apiModel: string;
}

const models: Model[] = [
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    description: "Fast & efficient",
    icon: Zap,
    color: "from-orange-500 to-yellow-500",
    apiModel: "google/gemini-2.5-flash"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Most capable",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    apiModel: "google/gemini-2.5-pro"
  },
  {
    id: "gpt5",
    name: "GPT-5",
    description: "Deep reasoning",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    apiModel: "openai/gpt-5"
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModel, onSelect }: ModelSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-4">
          Select AI Model
        </h3>
        <RadioGroup value={selectedModel} onValueChange={onSelect}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 glass-card rounded-xl">
            {models.map((model) => {
              const Icon = model.icon;
              const isSelected = selectedModel === model.id;
          
              return (
                <div key={model.id} className="relative">
                  <RadioGroupItem 
                    value={model.id} 
                    id={model.id}
                    className="peer sr-only"
                  />
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
        </RadioGroup>
      </div>
    </div>
  );
};

export { models };
