import Login from "@/components/auth/pages/sign-in";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <Login
      searchParams={resolvedParams}
    />
  )
}
