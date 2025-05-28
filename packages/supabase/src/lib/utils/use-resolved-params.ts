import { Message } from "../../types";
import { useEffect, useState } from "react";

export function useResolvedParams(
  searchParamsPromise: Promise<Message & { redirectTo?: string }>
) {
  const [resolvedParams, setResolvedParams] = useState<Message & { redirectTo?: string }>({});
  useEffect(() => {
    async function resolve() {
      const params = await searchParamsPromise;
      setResolvedParams(params);
    }
    resolve();
  }, [searchParamsPromise]);
  return resolvedParams;
}
