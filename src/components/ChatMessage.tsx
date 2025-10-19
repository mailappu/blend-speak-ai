import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === "user";
  
  return (
    <div className={cn(
      "flex gap-4 p-6 rounded-xl message-enter",
      isUser ? "bg-secondary/30" : "bg-card/30"
    )}>
      <Avatar className={cn(
        "h-8 w-8 border-2",
        isUser ? "border-accent" : "border-primary"
      )}>
        <AvatarFallback className={cn(
          "text-xs",
          isUser ? "bg-accent/20 text-accent" : "bg-gradient-to-br from-primary to-accent text-white"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">
            {isUser ? "You" : "AI Assistant"}
          </p>
          {timestamp && (
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          )}
        </div>
        <div className="prose prose-invert prose-sm max-w-none">
          <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
