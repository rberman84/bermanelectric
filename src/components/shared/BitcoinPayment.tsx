import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface BitcoinPaymentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BITCOIN_ADDRESS = "3CetitFdTkUiUaBioU2QjSCLggJMswYb7H";

const BitcoinPayment = ({ open, onOpenChange }: BitcoinPaymentProps) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(BITCOIN_ADDRESS);
    setCopied(true);
    toast.success("Bitcoin address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center">
            Pay with Bitcoin
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${BITCOIN_ADDRESS}`}
                alt="Bitcoin QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Bitcoin Address */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center font-medium">
              Send Bitcoin to this address:
            </p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-xs break-all font-mono">
                {BITCOIN_ADDRESS}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={copyAddress}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How to pay:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Scan the QR code with your Bitcoin wallet</li>
              <li>Or copy the address and paste it in your wallet</li>
              <li>Send the agreed amount in Bitcoin</li>
              <li>Contact us with your transaction ID</li>
            </ol>
          </div>

          {/* Contact Info */}
          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground">
              Questions? Call us at{" "}
              <a
                href="tel:+15163614068"
                className="text-foreground font-semibold hover:underline"
              >
                (516) 361-4068
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BitcoinPayment;
