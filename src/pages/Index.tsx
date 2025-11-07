import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SessionSidebar } from "@/components/SessionSidebar";
import { ModelSelector, models } from "@/components/ModelSelector";
import { ModelResponseCard } from "@/components/ModelResponseCard";
import { TransparencyInfo } from "@/components/TransparencyInfo";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Menu } from "lucide-react";
import { callMultipleModels, consolidateResponses, ModelResponse } from "@/lib/multiModelChat";
import { useToast } from "@/hooks/use-toast";
import {
  loadSessions,
  saveSessions,
  getActiveSessionId,
  setActiveSessionId,
  createNewSession,
  updateSession,
  deleteSession,
  renameSession,
  exportSession,
  generateSessionTitle,
  ConversationSession,
} from "@/lib/sessionManager";
import { getConfiguredModel, getCustomModel } from "@/lib/modelDefaults";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [enableConsolidation, setEnableConsolidation] = useState(false);
  const [selectedConsolidator, setSelectedConsolidator] = useState("gpt-4o");
  const [modelResponses, setModelResponses] = useState<Record<string, ModelResponse>>({});
  const [loadingModels, setLoadingModels] = useState<Set<string>>(new Set());
  const [consolidatedResponse, setConsolidatedResponse] = useState<string>("");
  const [isConsolidating, setIsConsolidating] = useState(false);

  const currentSession = sessions.find((s) => s.id === activeSessionId);

  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);
    const active = getActiveSessionId();
    if (active && loaded.find((s) => s.id === active)) {
      setActiveSessionIdState(active);
    } else if (loaded.length > 0) {
      setActiveSessionIdState(loaded[0].id);
      setActiveSessionId(loaded[0].id);
    }
  }, []);

  useEffect(() => {
    if (currentSession) {
      setSelectedModels(currentSession.selectedModels || []);
      setModelResponses(currentSession.modelResponses || {});
      setConsolidatedResponse(currentSession.consolidatedResponse || "");
    }
  }, [activeSessionId]);

  const handleNewChat = () => {
    const newSession = createNewSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionIdState(newSession.id);
    setActiveSessionId(newSession.id);
    setModelResponses({});
    setConsolidatedResponse("");
    setSelectedModels([]);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionIdState(id);
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    setSessions(loadSessions());
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    renameSession(id, newTitle);
    setSessions(loadSessions());
  };

  const handleExportSession = (id: string) => {
    exportSession(id);
    toast({
      title: "Session exported",
      description: "Your conversation has been exported as JSON.",
    });
  };

  const handleToggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const saveCurrentSession = () => {
    if (!currentSession) return;
    const updated: ConversationSession = {
      ...currentSession,
      selectedModels,
      modelResponses,
      consolidatedResponse,
      timestamp: new Date().toISOString(),
    };
    updateSession(updated);
    setSessions(loadSessions());
  };

  const handleSendMessage = async (content: string) => {
    if (selectedModels.length === 0) {
      toast({
        title: "No models selected",
        description: "Please select at least one AI model",
        variant: "destructive",
      });
      return;
    }

    if (!currentSession) {
      handleNewChat();
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...currentSession.messages, userMessage];
    const updatedSession: ConversationSession = {
      ...currentSession,
      messages: updatedMessages,
      title: currentSession.messages.length === 0 ? generateSessionTitle(content) : currentSession.title,
    };

    updateSession(updatedSession);
    setSessions(loadSessions());
    setModelResponses({});
    setConsolidatedResponse("");

    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Get actual model IDs to use based on configuration
    const selectedModelConfigs = selectedModels.map((modelId) => {
      const modelConfig = models.find((m) => m.id === modelId);
      if (!modelConfig) return null;

      const customModel = getCustomModel(modelConfig.provider);
      const actualModelId = customModel || getConfiguredModel(modelConfig.provider);

      return {
        id: actualModelId,
        name: modelConfig.name,
        provider: modelConfig.provider,
      };
    }).filter(Boolean) as Array<{ id: string; name: string; provider: "openai" | "anthropic" | "google" }>;

    // Check for missing API keys
    const missingKeys: string[] = [];
    selectedModelConfigs.forEach((model) => {
      const apiKey = localStorage.getItem(`${model.provider}_api_key`);
      if (!apiKey) {
        missingKeys.push(model.provider.toUpperCase());
      }
    });

    if (missingKeys.length > 0) {
      toast({
        title: "Missing API Keys",
        description: `Please add API keys for: ${missingKeys.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setLoadingModels(new Set(selectedModels));

    try {
      const responses = await callMultipleModels(
        selectedModelConfigs,
        apiMessages,
        (modelId, result) => {
          setModelResponses((prev) => ({ ...prev, [modelId]: result }));
          setLoadingModels((prev) => {
            const next = new Set(prev);
            next.delete(modelId);
            return next;
          });
        }
      );

      // Save responses to session
      const responsesMap: Record<string, ModelResponse> = {};
      responses.forEach((r) => {
        responsesMap[r.modelId] = {
          modelId: r.modelId,
          modelName: r.modelName,
          content: r.content,
          error: r.error,
        };
      });

      // Consolidate if enabled
      if (enableConsolidation && responses.some((r) => r.content)) {
        const consolidatorModelConfig = models.find((m) => m.id === selectedConsolidator);
        if (consolidatorModelConfig) {
          setIsConsolidating(true);
          try {
            const customModel = getCustomModel(consolidatorModelConfig.provider);
            const actualModelId = customModel || getConfiguredModel(consolidatorModelConfig.provider);

            const consolidated = await consolidateResponses(responses, {
              id: actualModelId,
              name: consolidatorModelConfig.name,
              provider: consolidatorModelConfig.provider,
            });

            setConsolidatedResponse(consolidated);

            // Save consolidated to session
            const finalSession: ConversationSession = {
              ...updatedSession,
              modelResponses: responsesMap,
              consolidatedResponse: consolidated,
            };
            updateSession(finalSession);
          } catch (error) {
            console.error("Consolidation error:", error);
            toast({
              title: "Consolidation failed",
              description: error instanceof Error ? error.message : "Failed to consolidate responses",
              variant: "destructive",
            });
          } finally {
            setIsConsolidating(false);
          }
        }
      } else {
        // Just save responses without consolidation
        const finalSession: ConversationSession = {
          ...updatedSession,
          modelResponses: responsesMap,
        };
        updateSession(finalSession);
      }

      setSessions(loadSessions());
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to get responses",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {sidebarOpen && (
        <SessionSidebar
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={handleSelectSession}
          onNewChat={handleNewChat}
          onDelete={handleDeleteSession}
          onRename={handleRenameSession}
          onExport={handleExportSession}
        />
      )}

      <main className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card/30 backdrop-blur-sm p-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Blend Speak AI
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Top Section: Input */}
        <div className="border-b border-border bg-card/20 backdrop-blur-sm p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSend={handleSendMessage}
              disabled={loadingModels.size > 0 || isConsolidating}
            />
          </div>
        </div>

        {/* Middle Section: Model Selector + Consolidation Control */}
        <div className="border-b border-border bg-card/10 backdrop-blur-sm p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">
            <ModelSelector selectedModels={selectedModels} onToggle={handleToggleModel} />
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="consolidate"
                  checked={enableConsolidation}
                  onCheckedChange={(checked) => setEnableConsolidation(checked as boolean)}
                />
                <Label htmlFor="consolidate" className="text-sm cursor-pointer">
                  Consolidate responses using
                </Label>
              </div>
              {enableConsolidation && (
                <Select value={selectedConsolidator} onValueChange={setSelectedConsolidator}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <TransparencyInfo />
          </div>
        </div>

        {/* Bottom Section: Outputs */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Consolidated Response */}
            {(isConsolidating || consolidatedResponse) && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                      Consolidated Response
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isConsolidating ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {consolidatedResponse}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Individual Model Responses */}
            {Object.keys(modelResponses).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Individual Model Responses
                </h3>
                <div className="space-y-3">
                  {selectedModels.map((modelId) => {
                    const config = models.find((m) => m.id === modelId);
                    const response = modelResponses[modelId];
                    const isLoading = loadingModels.has(modelId);

                    return (
                      <ModelResponseCard
                        key={modelId}
                        modelName={config?.name || modelId}
                        response={response?.content}
                        isLoading={isLoading}
                        error={response?.error}
                        color={config?.color || "from-gray-500 to-gray-700"}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chat History */}
            {currentSession && currentSession.messages.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground">Conversation History</h3>
                {currentSession.messages.map((msg) => (
                  <Card key={msg.id} className={msg.role === "user" ? "bg-secondary/30" : "bg-card/50"}>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1 capitalize">{msg.role}</p>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border p-2 flex-shrink-0 bg-card/20">
          <p className="text-center text-xs text-muted-foreground">
            Crafted by{" "}
            <a
              href="https://www.linkedin.com/in/pradeep-kumars/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Pradeep
            </a>{" "}
            • Assisted by LLMs
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
