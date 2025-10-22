import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <Card className={cn("glass-card", isLoading && "animate-pulse")}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className={cn("bg-gradient-to-br bg-clip-text text-transparent", color)}>
            {modelName}
          </span>
          {!isLoading && (
            error ? (
              <XCircle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            )
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-5/6 bg-muted" />
            <Skeleton className="h-4 w-4/6 bg-muted" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {response}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
