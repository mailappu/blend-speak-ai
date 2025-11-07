import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl w-full">
      <div className="flex gap-1 sm:gap-2 md:gap-3 items-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 hover:bg-secondary flex-shrink-0 hidden sm:flex"
        >
          <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </Button>
        
        <div className="flex-1 relative min-w-0">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={disabled}
            className={cn(
              "min-h-[40px] sm:min-h-[48px] max-h-[120px] sm:max-h-[200px] resize-none",
              "bg-secondary/50 border-border/50 text-xs sm:text-sm",
              "focus:bg-secondary focus:border-primary/50",
              "transition-all duration-200 w-full"
            )}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 hover:bg-secondary flex-shrink-0 hidden sm:flex"
        >
          <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </Button>

        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="icon"
          className={cn(
            "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0",
            "bg-gradient-to-r from-primary to-accent",
            "hover:opacity-90 transition-opacity",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </form>
  );
};
