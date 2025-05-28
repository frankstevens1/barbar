"use server";

import { redirect } from "next/navigation";
import { createClient } from "@workspace/supabase/client/server";

export default async function SignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
