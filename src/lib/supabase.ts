
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the Supabase URL and anon key are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL and anon key are required. Please make sure they are set in your Supabase project settings."
  );
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);

