const HISTORY_KEY = "ai_studio_history";

export interface HistoryItem {
  id: string;
  type: "image" | "video" | "voice" | "chat";
  prompt: string;
  timestamp: number;
  creditsUsed: number;
  result?: string;
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? (JSON.parse(stored) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: Omit<HistoryItem, "id" | "timestamp">): void {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).slice(2),
    timestamp: Date.now(),
  };
  history.unshift(newItem);
  // Keep last 50
  const trimmed = history.slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
