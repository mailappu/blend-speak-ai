import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
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
          <h1 className="text-3xl font-bold">Settings</h1>
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
              <Label htmlFor="openai">OpenAI API Key (GPT-4)</Label>
              <Input
                id="openai"
                type="password"
                placeholder="sk-..."
                value={apiKeys.openai}
                onChange={(e) => handleChange("openai", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropic">Anthropic API Key (Claude)</Label>
              <Input
                id="anthropic"
                type="password"
                placeholder="sk-ant-..."
                value={apiKeys.anthropic}
                onChange={(e) => handleChange("anthropic", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google">Google API Key (Gemini)</Label>
              <Input
                id="google"
                type="password"
                placeholder="AIza..."
                value={apiKeys.google}
                onChange={(e) => handleChange("google", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom">Custom API Key</Label>
              <Input
                id="custom"
                type="password"
                placeholder="Your custom model API key"
                value={apiKeys.custom}
                onChange={(e) => handleChange("custom", e.target.value)}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
