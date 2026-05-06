import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// We export a dummy client if keys are missing to prevent crash during build/dev
// but it will fail gracefully when trying to use it.
export const supabase = 
  supabaseUrl && supabaseKey 
    ? createClient(supabaseUrl, supabaseKey) 
    : null;
