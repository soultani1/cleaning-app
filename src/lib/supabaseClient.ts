import { createClient } from '@supabase/supabase-js'

// Read the environment variables from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if the variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in the .env.local file");
}

// Create and export the Supabase client using a NAMED EXPORT
export const supabase = createClient(supabaseUrl, supabaseAnonKey)