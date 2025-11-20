import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
          <p className="text-lg text-muted-foreground">
            Your request has been submitted successfully.
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 space-y-3">
          <p className="text-sm">
            Rob from Berman Electric will review your information and contact you shortly
            using your preferred method.
          </p>
          <p className="text-sm font-medium">
            Expected response time: Within 2-4 hours during business hours
          </p>
        </div>

        <Button onClick={() => navigate("/")} className="w-full">
          Return to Home
        </Button>
      </div>
    </div>
  );
};