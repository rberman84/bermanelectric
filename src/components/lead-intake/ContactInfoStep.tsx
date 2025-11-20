import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { LeadFormData } from "@/pages/LeadIntake";

interface ContactInfoStepProps {
  data: LeadFormData;
  updateData: (data: Partial<LeadFormData>) => void;
  onNext: () => void;
}

export const ContactInfoStep = ({ data, updateData, onNext }: ContactInfoStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length === 10;
  };

  const validateEmail = (email: string) => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(data.phone)) {
      newErrors.phone = "Please enter a valid 10-digit US phone number";
    }

    if (data.email && !validateEmail(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-muted-foreground">Let's start with your contact details</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={data.full_name}
            onChange={(e) => updateData({ full_name: e.target.value })}
            placeholder="John Doe"
            className={errors.full_name ? "border-destructive" : ""}
          />
          {errors.full_name && (
            <p className="text-sm text-destructive mt-1">{errors.full_name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="(555) 123-4567"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="john@example.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label>How would you prefer to be contacted? *</Label>
          <RadioGroup
            value={data.preferred_contact_method}
            onValueChange={(value: any) => updateData({ preferred_contact_method: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="call" id="call" />
              <Label htmlFor="call" className="font-normal cursor-pointer">Call</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="text" />
              <Label htmlFor="text" className="font-normal cursor-pointer">Text</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email-method" />
              <Label htmlFor="email-method" className="font-normal cursor-pointer">Email</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button onClick={handleNext} className="w-full">
        Next: Location
      </Button>
    </div>
  );
};