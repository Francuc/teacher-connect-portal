import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qhqtflpajutstecqajbl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRmbHBhanV0c3RlY3FhamJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NjE0OTgsImV4cCI6MjA0OTUzNzQ5OH0.C5wqqpv8SH6hu5xATTekQ6ziwuTDZmwzT1NHf9vhlbQ'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, falling back to defaults')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)