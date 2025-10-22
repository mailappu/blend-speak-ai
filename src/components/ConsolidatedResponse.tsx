import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface ConsolidatedResponseProps {
  consolidatedResponse?: string;
  isConsolidating: boolean;
  selectedConsolidator: string;
  onConsolidatorChange: (model: string) => void;
  availableModels: { id: string; name: string }[];
}

export const ConsolidatedResponse = ({
  consolidatedResponse,
  isConsolidating,
  selectedConsolidator,
  onConsolidatorChange,
  availableModels,
}: ConsolidatedResponseProps) => {
  return (
    <Card className="glass-card border-2 border-primary/50 shadow-lg glow-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Consolidated Response
          </span>
        </CardTitle>
        <div className="mt-3">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Consolidate using:
          </Label>
          <RadioGroup 
            value={selectedConsolidator} 
            onValueChange={onConsolidatorChange}
            className="flex gap-4"
          >
            {availableModels.map((model) => (
              <div key={model.id} className="flex items-center space-x-2">
                <RadioGroupItem value={model.id} id={`consolidator-${model.id}`} />
                <Label 
                  htmlFor={`consolidator-${model.id}`} 
                  className="text-sm cursor-pointer"
                >
                  {model.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardHeader>
      <CardContent>
        {isConsolidating ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-5/6 bg-muted" />
            <Skeleton className="h-4 w-4/6 bg-muted" />
          </div>
        ) : consolidatedResponse ? (
          <p className="text-base text-foreground/95 whitespace-pre-wrap leading-relaxed">
            {consolidatedResponse}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Waiting for model responses to consolidate...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
