import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ModelResponseCardProps {
  modelName: string;
  response?: string;
  isLoading: boolean;
  error?: string;
  color: string;
}

export const ModelResponseCard = ({ 
  modelName, 
  response, 
  isLoading, 
  error,
  color 
}: ModelResponseCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
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
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className={cn("bg-gradient-to-br bg-clip-text text-transparent", color)}>
            {modelName}
          </span>
          <div className="flex items-center gap-1">
            {!isLoading && response && (
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
            {!isLoading && (
              error ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : response ? (
                <CheckCircle2 className="h-4 w-4 text-accent" />
              ) : null
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full bg-muted" />
            <Skeleton className="h-3 w-5/6 bg-muted" />
            <Skeleton className="h-3 w-4/6 bg-muted" />
          </div>
        ) : error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : (
          <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {response}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
