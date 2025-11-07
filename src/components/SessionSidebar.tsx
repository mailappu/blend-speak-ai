import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Plus, Download, Trash2, Edit2, Check, X } from "lucide-react";
import { ConversationSession } from "@/lib/sessionManager";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SessionSidebarProps {
  sessions: ConversationSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onExport: (id: string) => void;
}

export const SessionSidebar = ({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onRename,
  onExport,
}: SessionSidebarProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEdit = (session: ConversationSession) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="w-56 sm:w-64 md:w-72 border-r border-border bg-sidebar flex flex-col h-full shadow-lg lg:shadow-none">
      <div className="p-2 sm:p-3 border-b border-border">
        <Button onClick={onNewChat} className="w-full" size="sm">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          <span className="text-xs sm:text-sm">New Chat</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-1.5 sm:p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group rounded-md sm:rounded-lg p-1.5 sm:p-2 transition-colors",
                activeId === session.id
                  ? "bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              {editingId === session.id ? (
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="h-6 sm:h-7 text-[10px] sm:text-xs"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0"
                    onClick={saveEdit}
                  >
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0"
                    onClick={cancelEdit}
                  >
                    <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className="cursor-pointer touch-manipulation"
                    onClick={() => onSelect(session.id)}
                  >
                    <h3 className="text-xs sm:text-sm font-medium truncate leading-tight">
                      {session.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                      {new Date(session.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 mt-1.5 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 sm:h-6 sm:w-6 touch-manipulation"
                      onClick={() => startEdit(session)}
                    >
                      <Edit2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 sm:h-6 sm:w-6 touch-manipulation"
                      onClick={() => onExport(session.id)}
                    >
                      <Download className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-destructive touch-manipulation"
                      onClick={() => onDelete(session.id)}
                    >
                      <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
