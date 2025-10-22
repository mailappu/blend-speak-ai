import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeys {
  openai: string;
  anthropic: string;
  google: string;
  custom: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false,
    custom: false,
  });
  
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: localStorage.getItem("openai_api_key") || "",
    anthropic: localStorage.getItem("anthropic_api_key") || "",
    google: localStorage.getItem("google_api_key") || "",
    custom: localStorage.getItem("custom_api_key") || "",
  });

  const handleSave = () => {
    localStorage.setItem("openai_api_key", apiKeys.openai);
    localStorage.setItem("anthropic_api_key", apiKeys.anthropic);
    localStorage.setItem("google_api_key", apiKeys.google);
    localStorage.setItem("custom_api_key", apiKeys.custom);
    
    toast({
      title: "Settings saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  const toggleShowKey = (provider: keyof ApiKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleChange = (provider: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">SuperLLM Settings</h1>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Configure your API keys for different AI providers. These are stored locally in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="openai">OpenAI API Key (ChatGPT GPT-4)</Label>
              <div className="relative">
                <Input
                  id="openai"
                  type={showKeys.openai ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKeys.openai}
                  onChange={(e) => handleChange("openai", e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleShowKey("openai")}
                >
                  {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropic">Anthropic API Key (Claude 3.5 Sonnet)</Label>
              <div className="relative">
                <Input
                  id="anthropic"
                  type={showKeys.anthropic ? "text" : "password"}
                  placeholder="sk-ant-..."
                  value={apiKeys.anthropic}
                  onChange={(e) => handleChange("anthropic", e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleShowKey("anthropic")}
                >
                  {showKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google">Google API Key (Gemini 1.5 Pro)</Label>
              <div className="relative">
                <Input
                  id="google"
                  type={showKeys.google ? "text" : "password"}
                  placeholder="AIza..."
                  value={apiKeys.google}
                  onChange={(e) => handleChange("google", e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleShowKey("google")}
                >
                  {showKeys.google ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom">Custom Model API Key</Label>
              <div className="relative">
                <Input
                  id="custom"
                  type={showKeys.custom ? "text" : "password"}
                  placeholder="Your custom model API key"
                  value={apiKeys.custom}
                  onChange={(e) => handleChange("custom", e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => toggleShowKey("custom")}
                >
                  {showKeys.custom ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save API Keys
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
