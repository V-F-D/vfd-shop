import { createClient } from "@supabase/supabase-js";

// Use placeholder fallbacks during next build if env vars are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

// Public client for use in browser/components (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for use in API routes/Server Actions (bypasses RLS)
export const getSupabaseAdmin = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
