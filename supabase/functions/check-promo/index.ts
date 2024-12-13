import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, check if user already has an active subscription
    const { data: teacherData, error: fetchError } = await supabaseClient
      .from('teachers')
      .select('subscription_status, subscription_end_date')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching teacher profile:', fetchError);
      throw fetchError;
    }

    // Check if subscription is still active
    const now = new Date()
    if (teacherData?.subscription_status === 'active' && 
        teacherData?.subscription_end_date && 
        new Date(teacherData.subscription_end_date) > now) {
      console.log('User already has an active subscription');
      return new Response(
        JSON.stringify({ success: false, message: 'already_active' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Set end date to 7 days from now
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + 7)

    console.log(`Applying promo code for user ${userId}`);
    
    const { error: updateError } = await supabaseClient
      .from('teachers')
      .update({
        subscription_status: 'active',
        subscription_type: 'promo',
        subscription_end_date: endDate.toISOString(),
        promo_code: promoCode.toUpperCase()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating teacher profile:', updateError);
      throw updateError;
    }

    console.log(`Successfully applied promo code. Subscription active until ${endDate.toISOString()}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing promo code:', error)
    return new Response(
      JSON.stringify({ success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})