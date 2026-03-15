const CREDITS_KEY = "ai_studio_credits";
const INITIAL_CREDITS = 100;

export const CREDIT_COSTS = {
  image: 10,
  video: 20,
  voice: 5,
  chat: 2,
} as const;

export type GenerationType = keyof typeof CREDIT_COSTS;

export function getCredits(): number {
  const stored = localStorage.getItem(CREDITS_KEY);
  if (stored === null) {
    localStorage.setItem(CREDITS_KEY, String(INITIAL_CREDITS));
    return INITIAL_CREDITS;
  }
  return Number(stored);
}

export function deductCredits(type: GenerationType): boolean {
  const current = getCredits();
  const cost = CREDIT_COSTS[type];
  if (current < cost) return false;
  localStorage.setItem(CREDITS_KEY, String(current - cost));
  return true;
}

export function resetCredits(): void {
  localStorage.setItem(CREDITS_KEY, String(INITIAL_CREDITS));
}
