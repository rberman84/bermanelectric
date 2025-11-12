import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [hasShown, setHasShown] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("exitIntentShown");
    if (hasSeenPopup) {
      setHasShown(true);
      return;
    }

    let timeOnPage = 0;
    const timer = setInterval(() => {
      timeOnPage += 1;
    }, 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 &&
        !hasShown &&
        timeOnPage >= 30 &&
        !hasSeenPopup
      ) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Integrate with email service
    toast({
      title: "Success!",
      description: "Check your email for your $50 discount code.",
    });
    
    setIsOpen(false);
    setEmail("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Wait! Get $50 Off Your First Service
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            Don't leave without your exclusive discount! Enter your email to receive:
          </p>
          
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-electric-600">✓</span>
              <span>$50 off your first electrical service</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-electric-600">✓</span>
              <span>Free electrical safety tips</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-electric-600">✓</span>
              <span>Priority scheduling for emergencies</span>
            </li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            <Button type="submit" className="w-full bg-electric-600 hover:bg-electric-700">
              Claim My $50 Discount
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            No spam. Unsubscribe anytime. Offer valid for new customers only.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
