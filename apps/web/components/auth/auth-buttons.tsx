import { signOutAction } from "@workspace/supabase/lib/auth-actions";
import { createClient } from "@workspace/supabase/client/server";
import { Button } from "@workspace/ui/components/button";

export default async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <a href="/sign-in">Sign in</a>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <a href="/sign-up">Sign up</a>
      </Button>
    </div>
  );
}
