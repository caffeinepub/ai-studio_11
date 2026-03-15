import { type GenerationType, deductCredits, getCredits } from "@/lib/credits";
import { useCallback, useEffect, useState } from "react";

export function useCredits() {
  const [credits, setCredits] = useState<number>(getCredits);

  const refresh = useCallback(() => {
    setCredits(getCredits());
  }, []);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("credits-updated", handler);
    return () => window.removeEventListener("credits-updated", handler);
  }, [refresh]);

  const spend = useCallback((type: GenerationType): boolean => {
    const ok = deductCredits(type);
    if (ok) {
      setCredits(getCredits());
      window.dispatchEvent(new Event("credits-updated"));
    }
    return ok;
  }, []);

  return { credits, spend, refresh };
}
