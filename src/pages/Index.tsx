import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ModelSelector } from "@/components/ModelSelector";
import { ModelResponseCard } from "@/components/ModelResponseCard";
import { ConsolidatedResponse } from "@/components/ConsolidatedResponse";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle } from "lucide-react";
import { callMultipleModels, consolidateResponses, ModelResponse, Message as ApiMessage } from "@/lib/multiModelChat";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const getHelpContent = () => `# How SuperLLM Works

SuperLLM is a multi-model AI chat interface that leverages different AI models to give you the best responses.

## Features

**1. Multiple AI Models**
Choose from:
- **Gemini Flash** - Fast & efficient for quick queries
- **Gemini Pro** - Most capable for complex reasoning
- **GPT-5** - Deep reasoning and creative tasks

**2. Streaming Responses**
All responses stream in real-time for a smooth experience.

**3. Simple & Clean Interface**
Easy to use on desktop and mobile devices.

## Getting Started

1. Select your preferred AI model from the options above
2. Type your question in the input box below
3. Press Enter or click Send
4. Watch as the AI responds in real-time!

## Tips

- Use **Gemini Flash** for quick answers and general queries
- Use **Gemini Pro** for complex analysis and reasoning
- Use **GPT-5** for creative writing and in-depth explanations

Try asking me anything!`;

const modelConfigs = [
  { id: "gpt-4", name: "ChatGPT", provider: "openai" as const, color: "from-blue-500 to-cyan-500" },
  { id: "claude-sonnet", name: "Claude", provider: "anthropic" as const, color: "from-purple-500 to-pink-500" },
  { id: "gemini-pro", name: "Gemini", provider: "google" as const, color: "from-orange-500 to-yellow-500" },
  { id: "custom", name: "Custom", provider: "openai" as const, color: "from-green-500 to-emerald-500" },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4"]);
  const [activeConversation, setActiveConversation] = useState("1");
  const [modelResponses, setModelResponses] = useState<Record<string, ModelResponse>>({});
  const [loadingModels, setLoadingModels] = useState<Set<string>>(new Set());
  const [consolidatedResponse, setConsolidatedResponse] = useState<string>("");
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [selectedConsolidator, setSelectedConsolidator] = useState("gpt-4");
  
  const [conversations] = useState([
    { id: "1", title: "Getting Started", timestamp: "Just now" },
    { id: "2", title: "Previous Chat", timestamp: "1 hour ago" },
    { id: "3", title: "Earlier Conversation", timestamp: "Yesterday" },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: getHelpContent(),
      timestamp: "Just now"
    }
  ]);

  const handleToggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMessage]);
    setModelResponses({});
    setConsolidatedResponse("");
    
    const apiMessages: ApiMessage[] = [
      { role: "system", content: "You are a helpful AI assistant." },
      ...messages.map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content
      })),
      { role: "user", content }
    ];

    const selectedModelConfigs = modelConfigs.filter(m => selectedModels.includes(m.id));
    setLoadingModels(new Set(selectedModels));

    try {
      const responses = await callMultipleModels(
        selectedModelConfigs,
        apiMessages,
        (modelId, result) => {
          setModelResponses(prev => ({ ...prev, [modelId]: result }));
          setLoadingModels(prev => {
            const next = new Set(prev);
            next.delete(modelId);
            return next;
          });
        }
      );

      // Auto-consolidate with selected model
      const consolidatorConfig = modelConfigs.find(m => m.id === selectedConsolidator);
      if (consolidatorConfig && responses.some(r => r.content)) {
        setIsConsolidating(true);
        try {
          const consolidated = await consolidateResponses(responses, consolidatorConfig);
          setConsolidatedResponse(consolidated);
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
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to get responses",
        variant: "destructive",
      });
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: getHelpContent(),
        timestamp: "Just now"
      }
    ]);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden lg:block">
        <ChatSidebar
          conversations={conversations}
          activeId={activeConversation}
          onSelect={setActiveConversation}
          onNewChat={handleNewChat}
        />
      </div>

      <main className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Header with Model Selector */}
        <header className="border-b border-border/50 p-2 sm:p-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm sm:text-base font-semibold">SuperLLM</h2>
            <div className="flex gap-2">
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
          <ModelSelector 
            selectedModels={selectedModels} 
            onToggle={handleToggleModel}
          />
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-2 sm:p-3">
          <div className="max-w-6xl mx-auto space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="text-xs sm:text-sm">
                <ChatMessage
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              </div>
            ))}
            
            {/* Model Responses */}
            {Object.keys(modelResponses).length > 0 && (
              <div className="space-y-6">
                {/* Consolidated Response */}
                <ConsolidatedResponse
                  consolidatedResponse={consolidatedResponse}
                  isConsolidating={isConsolidating}
                  selectedConsolidator={selectedConsolidator}
                  onConsolidatorChange={setSelectedConsolidator}
                  availableModels={modelConfigs.filter(m => selectedModels.includes(m.id))}
                />
                
                {/* Individual Model Responses */}
                <div>
                  <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2">
                    Individual Responses
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px]">
                    {selectedModels.map(modelId => {
                      const config = modelConfigs.find(m => m.id === modelId);
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
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border/50 p-2 sm:p-3 flex-shrink-0">
          <div className="max-w-6xl mx-auto space-y-1 sm:space-y-2">
            <ChatInput 
              onSend={handleSendMessage} 
              disabled={loadingModels.size > 0 || isConsolidating} 
            />
            <div className="text-center">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Crafted by <a 
                  href="https://www.linkedin.com/in/pradeep-kumars/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline transition-colors"
                >
                  Pradeep
                </a> • Assisted by LLMs
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
