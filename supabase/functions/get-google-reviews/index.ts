import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Fetching reviews from database...')
    
    // Get reviews from database, ordered by time descending
    const { data: reviews, error } = await supabase
      .from('google_reviews')
      .select('*')
      .order('time', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }

    console.log(`Found ${reviews?.length || 0} reviews`)

    // Get last sync time
    const { data: settings } = await supabase
      .from('google_settings')
      .select('last_synced_at')
      .single()

    return new Response(
      JSON.stringify({ 
        reviews: reviews || [],
        lastSynced: settings?.last_synced_at || null,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error getting reviews:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        reviews: [],
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})