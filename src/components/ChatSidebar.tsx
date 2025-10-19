import { MessageSquare, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  conversations: Array<{ id: string; title: string; timestamp: string }>;
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export const ChatSidebar = ({ conversations, activeId, onSelect, onNewChat }: ChatSidebarProps) => {
  return (
    <aside className="w-72 glass-card border-r flex flex-col h-screen">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary" />
            <div className="absolute inset-0 blur-md opacity-50">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MultiModel AI
          </h1>
        </div>
        <Button 
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all",
                "hover:bg-secondary/50 group",
                activeId === conv.id && "bg-secondary"
              )}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
