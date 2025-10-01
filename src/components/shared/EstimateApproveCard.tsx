import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Upsell {
  id: string;
  label: string;
  price: string;
}

interface EstimateApproveCardProps {
  estimateId: string;
  name: string;
  email: string;
}

const upsells: Upsell[] = [
  { id: 'surge', label: 'Whole-home surge protection', price: '$349' },
  { id: 'smoke', label: 'Smoke/CO detector upgrades', price: '$199' },
  { id: 'panel', label: 'Panel tune-up', price: '$149' },
];

export function EstimateApproveCard({ estimateId, name, email }: EstimateApproveCardProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleUpsell = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    );
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const chosenUpsells = upsells
        .filter(u => selected.includes(u.id))
        .map(u => `${u.label} (${u.price})`);

      const { data, error } = await supabase.functions.invoke('portal-estimate-approve', {
        body: {
          estimateId,
          name,
          email,
          upsells: chosenUpsells
        }
      });

      if (error) throw error;

      toast({
        title: "Estimate Approved",
        description: "We will reach out to schedule your service.",
      });
    } catch (error: any) {
      console.error('Approval error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve estimate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-neutral-900">Approve Estimate</h3>
      
      <div className="space-y-3 mb-4">
        {upsells.map(upsell => (
          <Label 
            key={upsell.id}
            htmlFor={upsell.id}
            className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 cursor-pointer hover:bg-neutral-50 transition"
          >
            <div className="flex-1">
              <div className="font-medium text-neutral-900">{upsell.label}</div>
              <div className="text-sm text-neutral-500">Add-on • {upsell.price}</div>
            </div>
            <Checkbox
              id={upsell.id}
              checked={selected.includes(upsell.id)}
              onCheckedChange={() => toggleUpsell(upsell.id)}
            />
          </Label>
        ))}
      </div>

      <Button 
        onClick={handleApprove}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? "Processing..." : "Approve & Continue"}
      </Button>
    </div>
  );
}
