import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ModelSelector } from "@/components/ModelSelector";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt4"]);
  const [consolidatorModel, setConsolidatorModel] = useState("claude");
  const [activeConversation, setActiveConversation] = useState("1");
  const [isTyping, setIsTyping] = useState(false);
  
  const [conversations] = useState([
    { id: "1", title: "AI Code Review Best Practices", timestamp: "2 min ago" },
    { id: "2", title: "React Performance Optimization", timestamp: "1 hour ago" },
    { id: "3", title: "Database Design Patterns", timestamp: "Yesterday" },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you with coding, writing, analysis, and much more. What would you like to explore today?",
      timestamp: "Just now"
    }
  ]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate multi-model AI response
    setTimeout(() => {
      const modelNames = selectedModels.map(m => m.toUpperCase()).join(", ");
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Multi-model response: Queried ${modelNames} and consolidated with ${consolidatorModel.toUpperCase()}.\n\nYour question: "${content}"\n\nThis simulated response demonstrates how multiple AI models would process your query and the ${consolidatorModel.toUpperCase()} model would synthesize their outputs into a comprehensive answer.`,
        timestamp: "Just now"
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI assistant. I can help you with coding, writing, analysis, and much more. What would you like to explore today?",
        timestamp: "Just now"
      }
    ]);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversation}
        onSelect={setActiveConversation}
        onNewChat={handleNewChat}
      />

      <main className="flex-1 flex flex-col h-screen">
        {/* Header with Model Selector */}
        <header className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Multi-Model AI Chat</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/help")}
                title="Help"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <ModelSelector 
            selectedModels={selectedModels} 
            onSelect={setSelectedModels}
            consolidatorModel={consolidatorModel}
            onConsolidatorChange={setConsolidatorModel}
          />
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border/50 p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                Crafted by <a 
                  href="https://www.linkedin.com/in/pradeep-kumars/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline transition-colors"
                >
                  Pradeep
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                Assisted by LLMs
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
