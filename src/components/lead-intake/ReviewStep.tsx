import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { LeadFormData } from "@/pages/LeadIntake";

interface ReviewStepProps {
  data: LeadFormData;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ReviewStep = ({ data, onBack, onEdit, onSubmit, isSubmitting }: ReviewStepProps) => {
  const priorityLabels = {
    emergency: "Emergency (Today/24 hours)",
    soon: "Soon (1-3 days)",
    flexible: "Flexible"
  };

  const contactMethodLabels = {
    call: "Call",
    text: "Text",
    email: "Email"
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">
          Please review your information before submitting
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm font-medium">Name:</span>
            <span className="ml-2 text-sm">{data.full_name}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Phone:</span>
            <span className="ml-2 text-sm">{data.phone}</span>
          </div>
          {data.email && (
            <div>
              <span className="text-sm font-medium">Email:</span>
              <span className="ml-2 text-sm">{data.email}</span>
            </div>
          )}
          <div>
            <span className="text-sm font-medium">Preferred Contact:</span>
            <span className="ml-2 text-sm">
              {contactMethodLabels[data.preferred_contact_method]}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Location</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm font-medium">Address:</span>
            <span className="ml-2 text-sm">{data.address_line1}</span>
          </div>
          {data.address_line2 && (
            <div>
              <span className="ml-2 text-sm">{data.address_line2}</span>
            </div>
          )}
          <div>
            <span className="text-sm">{data.city}, {data.state} {data.zip}</span>
          </div>
          {data.access_notes && (
            <div>
              <span className="text-sm font-medium">Access Notes:</span>
              <p className="text-sm mt-1">{data.access_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="text-sm font-medium">Job Type:</span>
            <span className="ml-2 text-sm">{data.job_type}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Priority:</span>
            <span className="ml-2 text-sm">{priorityLabels[data.job_priority]}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Description:</span>
            <p className="text-sm mt-1">{data.job_description}</p>
          </div>
          {data.budget_range && (
            <div>
              <span className="text-sm font-medium">Budget Range:</span>
              <span className="ml-2 text-sm">{data.budget_range}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Photos & Videos</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {data.files.length > 0 ? (
            <p className="text-sm">{data.files.length} file(s) uploaded</p>
          ) : (
            <p className="text-sm text-muted-foreground">No files uploaded</p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1" disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Lead"
          )}
        </Button>
      </div>
    </div>
  );
};