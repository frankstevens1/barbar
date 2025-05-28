import ResetPassword from "@/components/auth/pages/reset-password";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <ResetPassword
      searchParams={searchParams}
      requirements_option="option1"
    />
  )
}
