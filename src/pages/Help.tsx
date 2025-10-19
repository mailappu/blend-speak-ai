import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Help & API Setup</h1>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>How to Get API Keys</CardTitle>
            <CardDescription>
              Follow these steps to obtain API keys for different AI providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="openai">
                <AccordionTrigger className="text-lg font-semibold">
                  OpenAI API Key (GPT-4, GPT-5)
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Visit <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      OpenAI Platform <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>Sign up or log in to your account</li>
                    <li>Navigate to API Keys section from your account menu</li>
                    <li>Click "Create new secret key"</li>
                    <li>Copy the key (it starts with "sk-")</li>
                    <li>Paste it in the Settings page</li>
                  </ol>
                  <p className="text-sm mt-4 p-3 bg-accent/10 rounded-lg">
                    <strong>Note:</strong> OpenAI requires payment setup. Free tier has limited credits.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="anthropic">
                <AccordionTrigger className="text-lg font-semibold">
                  Anthropic API Key (Claude)
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Visit <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      Anthropic Console <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>Create an account or sign in</li>
                    <li>Go to API Keys section</li>
                    <li>Click "Create Key"</li>
                    <li>Copy the key (it starts with "sk-ant-")</li>
                    <li>Paste it in the Settings page</li>
                  </ol>
                  <p className="text-sm mt-4 p-3 bg-accent/10 rounded-lg">
                    <strong>Note:</strong> New users get free credits to test Claude models.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="google">
                <AccordionTrigger className="text-lg font-semibold">
                  Google API Key (Gemini)
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      Google AI Studio <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Get API Key" or "Create API Key"</li>
                    <li>Copy the generated key (starts with "AIza")</li>
                    <li>Paste it in the Settings page</li>
                  </ol>
                  <p className="text-sm mt-4 p-3 bg-accent/10 rounded-lg">
                    <strong>Note:</strong> Gemini offers generous free tier limits.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="custom">
                <AccordionTrigger className="text-lg font-semibold">
                  Custom Model API Key
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>For custom or fine-tuned models, follow your provider's documentation:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Hugging Face:</strong> Get token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      Settings <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li><strong>OpenRouter:</strong> Get key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      Dashboard <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li><strong>Azure OpenAI:</strong> Get credentials from Azure Portal</li>
                    <li><strong>Other providers:</strong> Check their documentation for API access</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>How Multi-Model Chat Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">1. Select Multiple Models</h3>
              <p>Choose one or more AI models to query simultaneously. Each model will process your prompt independently.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">2. Choose Consolidator</h3>
              <p>Select which model will combine and synthesize the responses from all queried models into a comprehensive answer.</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">3. Send Your Message</h3>
              <p>Your prompt is sent to all selected models, and the consolidator creates a unified response leveraging insights from each model.</p>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-6">
              <p className="text-sm text-foreground">
                <strong>Pro Tip:</strong> Use multiple models to get diverse perspectives, then let a powerful model like GPT-4 or Claude consolidate the best insights.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>🔒 All API keys are stored locally in your browser using localStorage</p>
            <p>🚫 Keys are never sent to any server except the respective AI provider APIs</p>
            <p>💾 Clear your browser data to remove stored API keys</p>
            <p>⚠️ Keep your API keys secure and never share them publicly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
