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
    <form onSubmit={handleSubmit} className="glass-card p-4 rounded-xl">
      <div className="flex gap-3 items-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 hover:bg-secondary"
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={disabled}
            className={cn(
              "min-h-[48px] max-h-[200px] resize-none",
              "bg-secondary/50 border-border/50",
              "focus:bg-secondary focus:border-primary/50",
              "transition-all duration-200"
            )}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 hover:bg-secondary"
        >
          <Mic className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="icon"
          className={cn(
            "h-10 w-10",
            "bg-gradient-to-r from-primary to-accent",
            "hover:opacity-90 transition-opacity",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
