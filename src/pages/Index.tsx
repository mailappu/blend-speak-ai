import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ModelSelector, models } from "@/components/ModelSelector";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle } from "lucide-react";
import { streamChat, Message as ApiMessage } from "@/lib/chatApi";
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

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState("gemini-flash");
  const [activeConversation, setActiveConversation] = useState("1");
  const [isTyping, setIsTyping] = useState(false);
  
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

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const apiMessages: ApiMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content
    }));
    apiMessages.push({ role: "user", content });

    let assistantSoFar = "";
    const selectedModelData = models.find(m => m.id === selectedModel);
    const apiModel = selectedModelData?.apiModel || "google/gemini-2.5-flash";

    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: "assistant", 
          content: assistantSoFar,
          timestamp: "Just now"
        }];
      });
    };

    try {
      await streamChat({
        messages: apiMessages,
        model: apiModel,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsTyping(false),
      });
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to get response",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
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

      <main className="flex-1 flex flex-col h-screen">
        {/* Header with Model Selector */}
        <header className="border-b border-border/50 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">SuperLLM</h2>
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
            selectedModel={selectedModel} 
            onSelect={setSelectedModel}
          />
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
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
        <div className="border-t border-border/50 p-3 sm:p-4">
          <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
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
