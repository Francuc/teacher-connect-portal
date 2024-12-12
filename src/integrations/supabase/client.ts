import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qhqtflpajutstecqajbl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRmbHBhanV0c3RlY3FhamJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NjE0OTgsImV4cCI6MjA0OTUzNzQ5OH0.C5wqqpv8SH6hu5xATTekQ6ziwuTDZmwzT1NHf9vhlbQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);