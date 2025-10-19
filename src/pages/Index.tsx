import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ModelSelector } from "@/components/ModelSelector";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const Index = () => {
  const [selectedModel, setSelectedModel] = useState("gpt4");
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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${content}". This is a simulated response using the ${selectedModel.toUpperCase()} model. In a production environment, this would connect to real AI APIs to provide intelligent responses based on your query.`,
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
          <ModelSelector 
            selectedModel={selectedModel} 
            onSelect={setSelectedModel}
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
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
