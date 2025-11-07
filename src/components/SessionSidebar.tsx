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
    <div className="w-64 border-r border-border bg-sidebar flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <Button onClick={onNewChat} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "group rounded-lg p-2 transition-colors",
                activeId === session.id
                  ? "bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              {editingId === session.id ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="h-7 text-xs"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0"
                    onClick={saveEdit}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0"
                    onClick={cancelEdit}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className="cursor-pointer"
                    onClick={() => onSelect(session.id)}
                  >
                    <h3 className="text-sm font-medium truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => startEdit(session)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onExport(session.id)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => onDelete(session.id)}
                    >
                      <Trash2 className="h-3 w-3" />
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
