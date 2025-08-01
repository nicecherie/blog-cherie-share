import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function createServerClient () {
  const cookieStore = cookies()

  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    // @ts-ignore
    cookies: {
      get(name: string) {
        // @ts-ignore
        return cookieStore.get(name)?.value
      },
    }
  })
}
