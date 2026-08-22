import { createClient } from "@supabase/supabase-js";

// Supabase environment credentials
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://kfudiuzbmtjwismckvnb.supabase.co";

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdWRpdXpibXRqd2lzbWNrdm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MjA2NzgsImV4cCI6MjEwMjk5NjY3OH0.0vu3yZO0qNLV9xL6Fj41HkBYEjvXLg00naPWZ5Bh8qE";

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes("placeholder")
  );
};

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export default supabase;
