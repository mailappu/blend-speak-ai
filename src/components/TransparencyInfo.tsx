import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Shield, Key, Database, AlertCircle } from "lucide-react";
import { useState } from "react";

export const TransparencyInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card className="glass-card border-accent/20">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                How This Works (Privacy & Transparency)
              </CardTitle>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <Key className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">You Bring Your Own API Keys (BYOK):</strong> Your personal API keys are stored locally in your browser. The app never sends them to any server or stores them in a database.
                </div>
              </div>

              <div className="flex gap-2">
                <Database className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">All Data Stays Local:</strong> Your prompts, responses, and conversation history remain on your device only. No backend server logs or stores your data.
                </div>
              </div>

              <div className="flex gap-2">
                <Shield className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Consolidation Happens Locally:</strong> When you enable response consolidation, the selected AI model processes the responses directly using your API key—no intermediate server involved.
                </div>
              </div>

              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Trade-offs:</strong> Since everything is local, your conversation history won't sync across devices. Export your sessions as JSON if you need backups.
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <strong className="text-foreground block mb-1">Advantages:</strong>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Complete privacy and data ownership</li>
                  <li>Full transparency in how your data is used</li>
                  <li>You control your API costs directly</li>
                  <li>No vendor lock-in or hidden fees</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
