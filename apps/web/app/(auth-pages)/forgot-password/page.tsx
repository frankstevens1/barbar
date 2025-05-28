import ForgotPassword from "@/components/auth/pages/forgot-password";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <ForgotPassword
      searchParams={searchParams}
    />
  )
}
