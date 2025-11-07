import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye, EyeOff, RotateCcw, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getConfiguredModel,
  setConfiguredModel,
  getConsolidationTemplate,
  setConsolidationTemplate,
  resetConsolidationTemplate,
  DEFAULT_MODELS,
} from "@/lib/modelDefaults";

interface ApiKeys {
  openai: string;
  anthropic: string;
  google: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false,
  });

  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: localStorage.getItem("openai_api_key") || "",
    anthropic: localStorage.getItem("anthropic_api_key") || "",
    google: localStorage.getItem("google_api_key") || "",
  });

  const [selectedModels, setSelectedModels] = useState({
    openai: getConfiguredModel("openai"),
    anthropic: getConfiguredModel("anthropic"),
    google: getConfiguredModel("google"),
  });

  const [consolidationTemplate, setConsolidationTemplateState] = useState(
    getConsolidationTemplate()
  );

  const handleSave = () => {
    // Save API keys
    localStorage.setItem("openai_api_key", apiKeys.openai);
    localStorage.setItem("anthropic_api_key", apiKeys.anthropic);
    localStorage.setItem("google_api_key", apiKeys.google);

    // Save model selections
    setConfiguredModel("openai", selectedModels.openai);
    setConfiguredModel("anthropic", selectedModels.anthropic);
    setConfiguredModel("google", selectedModels.google);

    // Save consolidation template
    setConsolidationTemplate(consolidationTemplate);

    // Save theme
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");

    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleResetTemplate = () => {
    resetConsolidationTemplate();
    setConsolidationTemplateState(getConsolidationTemplate());
    toast({
      title: "Template reset",
      description: "Consolidation template has been reset to default.",
    });
  };

  const toggleShowKey = (provider: keyof ApiKeys) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Consolidation Template */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Consolidation Prompt Template</CardTitle>
            <CardDescription>
              Customize the prompt used when consolidating responses from multiple models.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={consolidationTemplate}
              onChange={(e) => setConsolidationTemplateState(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <Button variant="outline" size="sm" onClick={handleResetTemplate}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </CardContent>
        </Card>

        {/* Model Configuration */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>
              Select which specific model to use for each provider and add your API keys.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>OpenAI Model</Label>
              <Select
                value={selectedModels.openai}
                onValueChange={(value) =>
                  setSelectedModels((prev) => ({ ...prev, openai: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o (Default)</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Key</Label>
                <div className="relative">
                  <Input
                    id="openai"
                    type={showKeys.openai ? "text" : "password"}
                    placeholder="sk-..."
                    value={apiKeys.openai}
                    onChange={(e) => handleKeyChange("openai", e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowKey("openai")}
                  >
                    {showKeys.openai ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Anthropic Model</Label>
              <Select
                value={selectedModels.anthropic}
                onValueChange={(value) =>
                  setSelectedModels((prev) => ({ ...prev, anthropic: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-sonnet-4-5">Claude 3.5 Sonnet (Default)</SelectItem>
                  <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                <Label htmlFor="anthropic">Anthropic API Key</Label>
                <div className="relative">
                  <Input
                    id="anthropic"
                    type={showKeys.anthropic ? "text" : "password"}
                    placeholder="sk-ant-..."
                    value={apiKeys.anthropic}
                    onChange={(e) => handleKeyChange("anthropic", e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowKey("anthropic")}
                  >
                    {showKeys.anthropic ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Google Model</Label>
              <Select
                value={selectedModels.google}
                onValueChange={(value) =>
                  setSelectedModels((prev) => ({ ...prev, google: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Default)</SelectItem>
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                <Label htmlFor="google">Google API Key</Label>
                <div className="relative">
                  <Input
                    id="google"
                    type={showKeys.google ? "text" : "password"}
                    placeholder="AIza..."
                    value={apiKeys.google}
                    onChange={(e) => handleKeyChange("google", e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleShowKey("google")}
                  >
                    {showKeys.google ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
