import { useState } from "react";
import { Zap, X, Send, Loader2, AlertTriangle, CheckCircle, Clock, Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  urgency?: "low" | "medium" | "high" | "emergency";
}

const quickQuestions = [
  "My outlets aren't working",
  "Lights are flickering",
  "Burning smell from outlet",
  "Circuit breaker keeps tripping",
  "Need EV charger installed"
];

const urgencyConfig = {
  emergency: {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Emergency - Call Now"
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    label: "High Priority"
  },
  medium: {
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    label: "Schedule Soon"
  },
  low: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Non-Urgent"
  }
};

export const AiTroubleshootChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-help-chat", {
        body: { 
          message: `You are an electrical troubleshooting assistant for Berman Electric. Analyze this issue and provide a helpful response. Be concise but thorough. If it's an emergency (sparks, fire, burning smell, exposed wires), emphasize calling 911 first then us. Issue: ${userMessage}`,
        },
      });

      if (error) throw error;

      // Parse urgency from response
      let urgency: "low" | "medium" | "high" | "emergency" = "medium";
      const reply = data.reply.toLowerCase();
      
      if (reply.includes("emergency") || reply.includes("911") || reply.includes("immediately") || reply.includes("fire") || reply.includes("burning")) {
        urgency = "emergency";
      } else if (reply.includes("soon") || reply.includes("safety concern") || reply.includes("should not")) {
        urgency = "high";
      } else if (reply.includes("schedule") || reply.includes("convenient")) {
        urgency = "low";
      }

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply,
        urgency 
      }]);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze issue. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
  };

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
  const currentUrgency = lastAssistantMessage?.urgency;
  const urgencyInfo = currentUrgency ? urgencyConfig[currentUrgency] : null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-700 hover:to-electric-600"
      >
        <Zap className="w-4 h-4" />
        Diagnose My Issue
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] h-[650px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-electric-600" />
                <span>AI Electrical Troubleshooter</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-electric-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Describe Your Electrical Issue</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI will help diagnose the problem and recommend next steps
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Common Issues</p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(q)}
                          className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-electric-600 text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Analyzing issue...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Urgency Banner */}
          {urgencyInfo && !isLoading && (
            <div className={`mx-6 mb-2 p-3 rounded-xl ${urgencyInfo.bg} ${urgencyInfo.border} border`}>
              <div className="flex items-center gap-2 mb-2">
                <urgencyInfo.icon className={`w-5 h-5 ${urgencyInfo.color}`} />
                <span className={`font-semibold ${urgencyInfo.color}`}>{urgencyInfo.label}</span>
              </div>
              <div className="flex gap-2">
                {currentUrgency === "emergency" && (
                  <a href="tel:911" className="flex-1">
                    <Button variant="destructive" className="w-full text-sm">
                      Call 911
                    </Button>
                  </a>
                )}
                <a href="tel:+15163614068" className="flex-1">
                  <Button 
                    variant={currentUrgency === "emergency" ? "outline" : "default"}
                    className="w-full text-sm gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    Call Us Now
                  </Button>
                </a>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full text-sm gap-1">
                    Schedule
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            {messages.length > 0 && (
              <button 
                onClick={resetChat}
                className="text-xs text-muted-foreground hover:text-foreground mb-2 underline"
              >
                Start new diagnosis
              </button>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your electrical issue..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiTroubleshootChat;