import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { LeadFormData } from "@/pages/LeadIntake";

interface JobDetailsStepProps {
  data: LeadFormData;
  updateData: (data: Partial<LeadFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const JOB_TYPES = [
  "Panel / Service Upgrade",
  "Troubleshooting / No Power",
  "Lighting Install",
  "EV Charger",
  "Landscape Lighting",
  "Other"
];

export const JobDetailsStep = ({ data, updateData, onNext, onBack }: JobDetailsStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.job_type) {
      newErrors.job_type = "Please select a job type";
    }

    if (!data.job_description.trim()) {
      newErrors.job_description = "Job description is required";
    } else if (data.job_description.trim().length < 10) {
      newErrors.job_description = "Please provide at least 10 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Job Details</h2>
        <p className="text-muted-foreground">Tell us about your electrical needs</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="job_type">Job Type *</Label>
          <Select value={data.job_type} onValueChange={(value) => updateData({ job_type: value })}>
            <SelectTrigger className={errors.job_type ? "border-destructive" : ""}>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.job_type && (
            <p className="text-sm text-destructive mt-1">{errors.job_type}</p>
          )}
        </div>

        <div>
          <Label>Priority *</Label>
          <RadioGroup
            value={data.job_priority}
            onValueChange={(value: any) => updateData({ job_priority: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="emergency" id="emergency" />
              <Label htmlFor="emergency" className="font-normal cursor-pointer">
                Emergency (Today/24 hours)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="soon" id="soon" />
              <Label htmlFor="soon" className="font-normal cursor-pointer">
                Soon (1-3 days)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" />
              <Label htmlFor="flexible" className="font-normal cursor-pointer">
                Flexible
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="job_description">Describe What's Going On *</Label>
          <Textarea
            id="job_description"
            value={data.job_description}
            onChange={(e) => updateData({ job_description: e.target.value })}
            placeholder="Please describe the issue or work needed in detail..."
            rows={5}
            className={errors.job_description ? "border-destructive" : ""}
          />
          {errors.job_description && (
            <p className="text-sm text-destructive mt-1">{errors.job_description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Minimum 10 characters
          </p>
        </div>

        <div>
          <Label htmlFor="budget_range">Budget Range (Optional)</Label>
          <Input
            id="budget_range"
            value={data.budget_range}
            onChange={(e) => updateData({ budget_range: e.target.value })}
            placeholder="e.g., $500-$1000"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Next: Photos/Videos
        </Button>
      </div>
    </div>
  );
};