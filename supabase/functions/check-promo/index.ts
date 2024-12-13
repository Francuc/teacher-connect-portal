import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { promoCode, userId } = await req.json()
    
    // Make the comparison case-insensitive
    if (promoCode.toUpperCase() !== 'PIERE') {
      console.log(`Invalid promo code attempted: ${promoCode}`);
      return new Response(
        JSON.stringify({ success: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Calculate end date (1 week from now)
    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + 7)

    console.log(`Applying promo code for user ${userId}`);
    
    const { error } = await supabaseClient
      .from('teachers')
      .update({
        subscription_status: 'active',
        subscription_type: 'promo',
        subscription_end_date: endDate.toISOString(),
        promo_code: promoCode.toUpperCase()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating teacher profile:', error);
      throw error;
    }

    console.log(`Successfully applied promo code. Subscription active until ${endDate.toISOString()}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in check-promo function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})