import { FormMessage } from "../form-message";
import { Message } from "@workspace/supabase/types";

interface PageProps {
  searchParams: Promise<Message>;
}

export default async function EmailChange({ searchParams }: PageProps) {
  // Wait for search params to resolve. The URL should contain a parameter like:
  // ?message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email
  const resolvedParams = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Email Change</h1>
        <FormMessage message={resolvedParams} />
      </div>
    </div>
  );
}
