import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LeadFormData } from "@/pages/LeadIntake";

interface LocationStepProps {
  data: LeadFormData;
  updateData: (data: Partial<LeadFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LocationStep = ({ data, updateData, onNext, onBack }: LocationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.address_line1.trim()) {
      newErrors.address_line1 = "Address is required";
    }

    if (!data.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!data.state.trim()) {
      newErrors.state = "State is required";
    } else if (data.state.length !== 2) {
      newErrors.state = "Please use 2-letter state code (e.g., NY)";
    }

    if (!data.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(data.zip)) {
      newErrors.zip = "Please enter a valid ZIP code";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Location Details</h2>
        <p className="text-muted-foreground">Where is the work needed?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="address_line1">Address Line 1 *</Label>
          <Input
            id="address_line1"
            value={data.address_line1}
            onChange={(e) => updateData({ address_line1: e.target.value })}
            placeholder="123 Main St"
            className={errors.address_line1 ? "border-destructive" : ""}
          />
          {errors.address_line1 && (
            <p className="text-sm text-destructive mt-1">{errors.address_line1}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
          <Input
            id="address_line2"
            value={data.address_line2}
            onChange={(e) => updateData({ address_line2: e.target.value })}
            placeholder="Apt, Suite, Unit, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              placeholder="New York"
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && (
              <p className="text-sm text-destructive mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value.toUpperCase() })}
              placeholder="NY"
              maxLength={2}
              className={errors.state ? "border-destructive" : ""}
            />
            {errors.state && (
              <p className="text-sm text-destructive mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="zip">ZIP Code *</Label>
          <Input
            id="zip"
            value={data.zip}
            onChange={(e) => updateData({ zip: e.target.value })}
            placeholder="11747"
            className={errors.zip ? "border-destructive" : ""}
          />
          {errors.zip && (
            <p className="text-sm text-destructive mt-1">{errors.zip}</p>
          )}
        </div>

        <div>
          <Label htmlFor="access_notes">Access Notes (Optional)</Label>
          <Textarea
            id="access_notes"
            value={data.access_notes}
            onChange={(e) => updateData({ access_notes: e.target.value })}
            placeholder="Gate codes, parking instructions, pet information, etc."
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Next: Job Details
        </Button>
      </div>
    </div>
  );
};