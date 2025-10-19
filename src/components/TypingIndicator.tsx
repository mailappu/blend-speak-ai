import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-4 p-6 rounded-xl bg-card/30 message-enter">
      <Avatar className="h-8 w-8 border-2 border-primary">
        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold">AI Assistant</p>
        <div className="flex gap-1 typing-indicator">
          <span style={{ "--i": 0 } as React.CSSProperties}></span>
          <span style={{ "--i": 1 } as React.CSSProperties}></span>
          <span style={{ "--i": 2 } as React.CSSProperties}></span>
        </div>
      </div>
    </div>
  );
};
