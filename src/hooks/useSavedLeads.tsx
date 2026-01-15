import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { extractContacts } from '@/lib/extractContacts';

export type SavedLead = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  content_preview: string | null;
  source_query: string | null;
  lead_type: string;
  status: string;
  priority: string;
  notes: string | null;
  contact_info: {
    emails?: string[];
    phones?: string[];
  } | null;
  saved_by: string | null;
  created_at: string;
  updated_at: string;
  followed_up_at: string | null;
};

export const useSavedLeads = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [savingUrls, setSavingUrls] = useState<Set<string>>(new Set());

  const { data: savedLeads = [], isLoading, refetch } = useQuery({
    queryKey: ['saved-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SavedLead[];
    },
  });

  const saveLead = useMutation({
    mutationFn: async (lead: {
      title: string;
      url: string;
      description?: string;
      content_preview?: string;
      source_query?: string;
      lead_type?: string;
    }) => {
      setSavingUrls(prev => new Set(prev).add(lead.url));
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Auto-extract contact information from content
      const contentToScan = [
        lead.content_preview || '',
        lead.description || '',
        lead.title || '',
      ].join('\n');
      
      const extractedContacts = extractContacts(contentToScan);
      
      const { data, error } = await supabase
        .from('saved_leads')
        .insert({
          title: lead.title,
          url: lead.url,
          description: lead.description || null,
          content_preview: lead.content_preview?.slice(0, 2000) || null,
          source_query: lead.source_query || null,
          lead_type: lead.lead_type || 'general',
          saved_by: user?.id || null,
          contact_info: extractedContacts.hasContacts ? {
            emails: extractedContacts.emails,
            phones: extractedContacts.phones,
          } : null,
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('Lead already saved');
        }
        throw error;
      }
      return { data, hasContacts: extractedContacts.hasContacts };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['saved-leads'] });
      const contactMsg = result.hasContacts 
        ? ' Contact info extracted!' 
        : '';
      toast({ 
        title: 'Lead saved', 
        description: `Added to your saved leads for follow-up.${contactMsg}` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save lead', 
        variant: 'destructive' 
      });
    },
    onSettled: (_, __, variables) => {
      setSavingUrls(prev => {
        const next = new Set(prev);
        next.delete(variables.url);
        return next;
      });
    },
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SavedLead> }) => {
      const { data, error } = await supabase
        .from('saved_leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-leads'] });
      toast({ title: 'Lead updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update lead', variant: 'destructive' });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('saved_leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-leads'] });
      toast({ title: 'Lead deleted' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete lead', variant: 'destructive' });
    },
  });

  const isUrlSaved = (url: string) => savedLeads.some(lead => lead.url === url);
  const isSaving = (url: string) => savingUrls.has(url);

  return {
    savedLeads,
    isLoading,
    saveLead: saveLead.mutate,
    updateLead: updateLead.mutate,
    deleteLead: deleteLead.mutate,
    isUrlSaved,
    isSaving,
    refetch,
  };
};
