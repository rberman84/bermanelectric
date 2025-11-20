import { useState } from "react";
import SEO from "@/components/SEO";
import { Progress } from "@/components/ui/progress";
import { ContactInfoStep } from "@/components/lead-intake/ContactInfoStep";
import { LocationStep } from "@/components/lead-intake/LocationStep";
import { JobDetailsStep } from "@/components/lead-intake/JobDetailsStep";
import { MediaUploadStep } from "@/components/lead-intake/MediaUploadStep";
import { ReviewStep } from "@/components/lead-intake/ReviewStep";
import { SuccessScreen } from "@/components/lead-intake/SuccessScreen";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LeadFormData {
  // Contact Info
  full_name: string;
  phone: string;
  email: string;
  preferred_contact_method: "call" | "text" | "email";
  
  // Location
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  access_notes: string;
  
  // Job Details
  job_type: string;
  job_priority: "emergency" | "soon" | "flexible";
  job_description: string;
  budget_range: string;
  
  // Media
  files: File[];
}

const STEPS = [
  "Contact Info",
  "Location",
  "Job Details",
  "Photos/Videos",
  "Review & Submit"
];

const LeadIntake = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    full_name: "",
    phone: "",
    email: "",
    preferred_contact_method: "call",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip: "",
    access_notes: "",
    job_type: "",
    job_priority: "soon",
    job_description: "",
    budget_range: "",
    files: []
  });

  const updateFormData = (data: Partial<LeadFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Upload files to storage
      const fileUrls: { url: string; type: string }[] = [];
      
      for (const file of formData.files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('lead-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('lead-files')
          .getPublicUrl(filePath);

        fileUrls.push({
          url: publicUrl,
          type: file.type.startsWith('video/') ? 'video' : 'image'
        });
      }

      // Create lead record
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert({
          source: 'Thumbtack',
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || null,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2 || null,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          preferred_contact_method: formData.preferred_contact_method,
          job_type: formData.job_type,
          job_priority: formData.job_priority,
          job_description: formData.job_description,
          budget_range: formData.budget_range || null,
          access_notes: formData.access_notes || null,
          status: 'new'
        })
        .select()
        .single();

      if (leadError) throw leadError;

      // Create media records
      if (fileUrls.length > 0) {
        const mediaRecords = fileUrls.map(file => ({
          lead_id: lead.id,
          file_url: file.url,
          file_type: file.type
        }));

        const { error: mediaError } = await supabase
          .from('lead_media')
          .insert(mediaRecords);

        if (mediaError) throw mediaError;
      }

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          lead: {
            ...formData,
            id: lead.id
          },
          mediaUrls: fileUrls.map(f => f.url)
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the submission if email fails
      }

      setIsSuccess(true);
      toast.success("Lead submitted successfully!");
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error(error.message || "Failed to submit lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessScreen />;
  }

  const progress = (currentStep / 5) * 100;

  return (
    <>
      <SEO
        title="Lead Intake Portal - Berman Electric"
        description="Submit your electrical service request with detailed information and photos for a precise quote."
      />
      
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-2">Lead Intake Portal</h1>
            <p className="text-center text-muted-foreground mb-6">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]}
            </p>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6">
            {currentStep === 1 && (
              <ContactInfoStep
                data={formData}
                updateData={updateFormData}
                onNext={handleNext}
              />
            )}
            
            {currentStep === 2 && (
              <LocationStep
                data={formData}
                updateData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 3 && (
              <JobDetailsStep
                data={formData}
                updateData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 4 && (
              <MediaUploadStep
                files={formData.files}
                updateFiles={(files) => updateFormData({ files })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 5 && (
              <ReviewStep
                data={formData}
                onBack={handleBack}
                onEdit={setCurrentStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadIntake;