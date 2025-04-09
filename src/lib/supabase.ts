
import { createClient } from '@supabase/supabase-js';

// Set environment variables for Supabase
import.meta.env.VITE_SUPABASE_URL = 'https://qobzgblhdztldvbghpjo.supabase.co';
import.meta.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvYnpnYmxoZHp0bGR2YmdocGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTgzMDEsImV4cCI6MjA1OTc5NDMwMX0.MmBQ6gt7qtpW1LsqDL2hp4tpSnTzXPVEAR83vkB_t6M';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
