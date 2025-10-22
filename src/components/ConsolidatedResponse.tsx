import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!consolidatedResponse) return;
    try {
      await navigator.clipboard.writeText(consolidatedResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Response copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card border-2 border-primary/50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Consolidated Response
            </span>
          </CardTitle>
          {consolidatedResponse && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-accent" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
        <div className="mt-2">
          <Label className="text-[10px] text-muted-foreground mb-1 block">
            Consolidate using:
          </Label>
          <RadioGroup 
            value={selectedConsolidator} 
            onValueChange={onConsolidatorChange}
            className="flex gap-3 flex-wrap"
          >
            {availableModels.map((model) => (
              <div key={model.id} className="flex items-center space-x-1.5">
                <RadioGroupItem value={model.id} id={`consolidator-${model.id}`} className="h-3 w-3" />
                <Label 
                  htmlFor={`consolidator-${model.id}`} 
                  className="text-xs cursor-pointer"
                >
                  {model.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isConsolidating ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full bg-muted" />
            <Skeleton className="h-3 w-5/6 bg-muted" />
            <Skeleton className="h-3 w-4/6 bg-muted" />
          </div>
        ) : consolidatedResponse ? (
          <p className="text-sm text-foreground/95 whitespace-pre-wrap leading-relaxed">
            {consolidatedResponse}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Waiting for model responses...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
