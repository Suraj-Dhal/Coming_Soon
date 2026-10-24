import { createClient } from "@supabase/supabase-js";
import type { ContactInput } from "@/lib/contact";

export type StoreResult = "stored" | "rate_limited" | "unavailable";

// Inserts with the publishable key. RLS allows this role to insert into
// coming_soon_messages and nothing else, so no secret key lives in the app.
export async function storeMessage(input: ContactInput): Promise<StoreResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("[contact] SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not set");
    return "unavailable";
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // No .select(): the anon role cannot read rows back, so ask for a minimal response.
  const { error } = await supabase.from("coming_soon_messages").insert(input);
  if (!error) return "stored";
  if (error.message?.includes("rate_limited")) return "rate_limited";

  console.error("[contact] Supabase insert failed:", error.code, error.message);
  return "unavailable";
}
