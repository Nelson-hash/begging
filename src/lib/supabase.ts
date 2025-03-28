import { createClient } from '@supabase/supabase-js';

// Provide default values for development to prevent crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a check to warn if Supabase is not properly configured
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials are missing. Please click the "Connect to Supabase" button in the top right to set up your Supabase project.'
  );
}