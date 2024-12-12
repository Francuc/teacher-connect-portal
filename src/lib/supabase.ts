import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhqtflpajutstecqajbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRmbHBhanV0c3RlY3FhamJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NjE0OTgsImV4cCI6MjA0OTUzNzQ5OH0.C5wqqpv8SH6hu5xATTekQ6ziwuTDZmwzT1NHf9vhlbQ';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);