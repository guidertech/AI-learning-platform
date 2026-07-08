import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder" && supabaseAnonKey !== "placeholder");

export const supabase = hasSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Unique profile ID for local testing/single user context
export const getLocalProfileId = (): string => {
  if (typeof window === "undefined") return "server-temp-id";
  let id = localStorage.getItem("classorbit_profile_id");
  if (!id) {
    id = `profile-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("classorbit_profile_id", id);
  }
  return id;
};
