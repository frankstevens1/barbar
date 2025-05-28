import SignUp from "@/components/auth/pages/sign-up";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <SignUp
      searchParams={searchParams}
      requirements_option="option1"
    />
  )
}
