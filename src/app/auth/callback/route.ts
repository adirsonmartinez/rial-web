import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole, isAdminRole } from "@/lib/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let defaultNext = "/app";
      if (user) {
        const role = await getUserRole(supabase, user.id);
        if (isAdminRole(role)) defaultNext = "/admin";
      }
      const next = requestedNext ?? defaultNext;
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
