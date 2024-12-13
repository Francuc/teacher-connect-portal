import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        if (!customer.email) break
        
        const { data: teachers } = await supabaseClient
          .from('teachers')
          .select('user_id')
          .eq('email', customer.email)
          .single()

        if (!teachers?.user_id) break

        // Get the subscription interval (month or year)
        const interval = subscription.items.data[0].price.recurring?.interval
        
        // Calculate end date based on subscription type
        const now = new Date()
        let endDate = new Date(now)
        
        if (interval === 'month') {
          endDate.setMonth(endDate.getMonth() + 1)
        } else if (interval === 'year') {
          endDate.setFullYear(endDate.getFullYear() + 1)
        }

        await supabaseClient
          .from('teachers')
          .update({
            subscription_status: subscription.status,
            subscription_type: interval,
            subscription_end_date: endDate.toISOString()
          })
          .eq('user_id', teachers.user_id)
        
        console.log(`Subscription updated for user ${teachers.user_id}: ${interval}ly subscription until ${endDate.toISOString()}`)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        const deletedCustomer = await stripe.customers.retrieve(deletedSubscription.customer as string)
        
        if (!deletedCustomer.email) break
        
        const { data: teacherToUpdate } = await supabaseClient
          .from('teachers')
          .select('user_id')
          .eq('email', deletedCustomer.email)
          .single()

        if (!teacherToUpdate?.user_id) break

        await supabaseClient
          .from('teachers')
          .update({
            subscription_status: 'inactive',
            subscription_type: null,
            subscription_end_date: null
          })
          .eq('user_id', teacherToUpdate.user_id)
        break
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      `Webhook Error: ${err.message}`,
      { status: 400 }
    )
  }
})