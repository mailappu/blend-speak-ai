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
import { Settings, Menu, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [selectedProviders, setSelectedProviders] = useState<("openai" | "anthropic" | "google")[]>([]);
  const [enableConsolidation, setEnableConsolidation] = useState(false);
  const [selectedConsolidator, setSelectedConsolidator] = useState<"openai" | "anthropic" | "google">("openai");
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
      setSelectedProviders(currentSession.selectedProviders || []);
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
    setSelectedProviders([]);
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

  const handleToggleProvider = (provider: "openai" | "anthropic" | "google") => {
    setSelectedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
    );
  };

  const saveCurrentSession = () => {
    if (!currentSession) return;
    const updated: ConversationSession = {
      ...currentSession,
      selectedProviders,
      modelResponses,
      consolidatedResponse,
      timestamp: new Date().toISOString(),
    };
    updateSession(updated);
    setSessions(loadSessions());
  };

  const handleSendMessage = async (content: string) => {
    console.log("=== SEND MESSAGE TRIGGERED ===");
    console.log("Selected providers:", selectedProviders);
    console.log("Message content:", content);
    
    if (selectedProviders.length === 0) {
      console.warn("No providers selected");
      toast({
        title: "No providers selected",
        description: "Please select at least one AI provider",
        variant: "destructive",
      });
      return;
    }

    if (!currentSession) {
      console.log("No current session, creating new chat");
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
    const selectedModelConfigs = selectedProviders.map((provider) => {
      const customModel = getCustomModel(provider);
      const actualModelId = customModel || getConfiguredModel(provider);
      const providerName = provider === "openai" ? "OpenAI" : provider === "anthropic" ? "Claude" : "Gemini";

      return {
        id: actualModelId,
        name: providerName,
        provider: provider,
      };
    });

    // Check for missing API keys
    console.log("Checking API keys...");
    const missingKeys: string[] = [];
    selectedModelConfigs.forEach((model) => {
      const apiKey = localStorage.getItem(`${model.provider}_api_key`);
      console.log(`API key for ${model.provider}:`, apiKey ? "PRESENT" : "MISSING");
      if (!apiKey) {
        missingKeys.push(model.provider.toUpperCase());
      }
    });

    if (missingKeys.length > 0) {
      console.warn("Missing API keys:", missingKeys);
      toast({
        title: "Missing API Keys",
        description: `Please add API keys for: ${missingKeys.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    console.log("All API keys present, proceeding with request");
    
    // Show immediate feedback
    toast({
      title: "Processing Request",
      description: `Querying ${selectedProviders.length} model${selectedProviders.length > 1 ? 's' : ''}...`,
    });
    
    setLoadingModels(new Set(selectedProviders));
    console.log("Loading models set:", selectedProviders);
    
    try {
      console.log("Calling callMultipleModels with configs:", selectedModelConfigs);
      const responses = await callMultipleModels(
        selectedModelConfigs,
        apiMessages,
        (provider, result) => {
          console.log(`✓ Progress update from ${provider}:`, result);
          setModelResponses((prev) => {
            const updated = { ...prev, [provider]: result };
            console.log("Updated model responses state:", updated);
            return updated;
          });
          setLoadingModels((prev) => {
            const next = new Set(prev);
            next.delete(provider);
            console.log("Removed from loading:", provider, "Remaining:", Array.from(next));
            return next;
          });
        }
      );
      
      console.log("All model calls completed. Responses:", responses);

      // Save responses to session (indexed by provider)
      const responsesMap: Record<string, ModelResponse> = {};
      selectedModelConfigs.forEach((config, index) => {
        const response = responses[index];
        responsesMap[config.provider] = {
          modelId: response.modelId,
          modelName: response.modelName,
          content: response.content,
          error: response.error,
        };
      });

      // Consolidate if enabled
      if (enableConsolidation && responses.some((r) => r.content)) {
        setIsConsolidating(true);
        try {
          const customModel = getCustomModel(selectedConsolidator);
          const actualModelId = customModel || getConfiguredModel(selectedConsolidator);
          const providerName = selectedConsolidator === "openai" ? "OpenAI" : selectedConsolidator === "anthropic" ? "Claude" : "Gemini";

          const consolidated = await consolidateResponses(responses, {
            id: actualModelId,
            name: providerName,
            provider: selectedConsolidator,
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
      console.error("❌ ERROR in handleSendMessage:", e);
      console.error("Error stack:", e instanceof Error ? e.stack : "No stack trace");
      
      // Clear loading states on error
      setLoadingModels(new Set());
      
      toast({
        title: "Request Failed",
        description: e instanceof Error ? e.message : "Failed to get responses. Check console for details.",
        variant: "destructive",
      });
    }
    
    console.log("=== SEND MESSAGE COMPLETE ===");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile/Tablet Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 lg:relative lg:z-0",
            "transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}>
            <SessionSidebar
              sessions={sessions}
              activeId={activeSessionId}
              onSelect={handleSelectSession}
              onNewChat={handleNewChat}
              onDelete={handleDeleteSession}
              onRename={handleRenameSession}
              onExport={handleExportSession}
            />
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden w-full">
        {/* Header */}
        <header className="border-b border-border bg-card/30 backdrop-blur-sm px-3 py-2 sm:p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Super LLM
              </h2>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/help")}
                title="Help"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
                title="Settings"
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Top Section: Input */}
        <div className="border-b border-border bg-card/20 backdrop-blur-sm px-3 py-3 sm:p-4 md:p-5 flex-shrink-0">
          <div className="max-w-4xl mx-auto w-full">
            <ChatInput
              onSend={handleSendMessage}
              disabled={loadingModels.size > 0 || isConsolidating}
            />
          </div>
        </div>

        {/* Middle Section: Provider Selector + Consolidation Control */}
        <div className="border-b border-border bg-card/10 backdrop-blur-sm px-3 py-3 sm:p-4 md:p-5 flex-shrink-0">
          <div className="max-w-4xl mx-auto w-full space-y-3 sm:space-y-4">
            <ModelSelector selectedProviders={selectedProviders} onToggle={handleToggleProvider} />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="consolidate"
                  checked={enableConsolidation}
                  onCheckedChange={(checked) => setEnableConsolidation(checked as boolean)}
                />
                <Label htmlFor="consolidate" className="text-xs sm:text-sm cursor-pointer">
                  Consolidate responses
                </Label>
              </div>
              {enableConsolidation && (
                <Select value={selectedConsolidator} onValueChange={(value) => setSelectedConsolidator(value as "openai" | "anthropic" | "google")}>
                  <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Claude</SelectItem>
                    <SelectItem value="google">Gemini</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <TransparencyInfo />
          </div>
        </div>

        {/* Bottom Section: Outputs */}
        <ScrollArea className="flex-1 px-3 py-4 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto w-full space-y-3 sm:space-y-4 md:space-y-5">
            {/* Consolidated Response */}
            {(isConsolidating || consolidatedResponse) && (
              <Card className="glass-card">
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                    <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                      Consolidated Response
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  {isConsolidating ? (
                    <div className="space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-full" />
                      <Skeleton className="h-3 sm:h-4 w-5/6" />
                      <Skeleton className="h-3 sm:h-4 w-4/6" />
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm md:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed max-w-prose">
                      {consolidatedResponse}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Individual Model Responses */}
            {Object.keys(modelResponses).length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground px-1">
                  Individual Model Responses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                     {selectedProviders.map((provider) => {
                       const response = modelResponses[provider];
                       const isLoading = loadingModels.has(provider);
                       const providerName = provider === "openai" ? "OpenAI" : provider === "anthropic" ? "Claude" : "Gemini";
                       const color = provider === "openai" ? "from-blue-500 to-cyan-500" : provider === "anthropic" ? "from-purple-500 to-pink-500" : "from-orange-500 to-yellow-500";

                       return (
                         <ModelResponseCard
                           key={provider}
                           modelName={providerName}
                           response={response?.content}
                           isLoading={isLoading}
                           error={response?.error}
                           color={color}
                         />
                       );
                     })}
                </div>
              </div>
            )}

            {/* Chat History */}
            {currentSession && currentSession.messages.length > 0 && (
              <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-border">
                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground px-1">Conversation History</h3>
                <div className="space-y-2 sm:space-y-3">
                  {currentSession.messages.map((msg) => (
                    <Card key={msg.id} className={msg.role === "user" ? "bg-secondary/30" : "bg-card/50"}>
                      <CardContent className="p-2 sm:p-3 md:p-4">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 capitalize font-medium">{msg.role}</p>
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed max-w-prose">{msg.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border px-2 py-2 sm:p-3 flex-shrink-0 bg-card/20">
          <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
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
