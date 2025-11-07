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
      <CardHeader className="p-2 sm:p-3 md:pb-2 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-xs sm:text-sm">
          <span className={cn("bg-gradient-to-br bg-clip-text text-transparent font-semibold", color)}>
            {modelName}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {!isLoading && response && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-7 sm:w-7 touch-manipulation"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-accent" />
                ) : (
                  <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                )}
              </Button>
            )}
            {!isLoading && (
              error ? (
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
              ) : response ? (
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
              ) : null
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-2 sm:p-3 md:p-4">
        {isLoading ? (
          <div className="space-y-1.5 sm:space-y-2">
            <Skeleton className="h-2.5 sm:h-3 w-full bg-muted" />
            <Skeleton className="h-2.5 sm:h-3 w-5/6 bg-muted" />
            <Skeleton className="h-2.5 sm:h-3 w-4/6 bg-muted" />
          </div>
        ) : error ? (
          <p className="text-[10px] sm:text-xs text-destructive">{error}</p>
        ) : (
          <p className="text-[10px] sm:text-xs md:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed max-w-prose">
            {response}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
