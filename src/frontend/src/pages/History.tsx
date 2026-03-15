import { GeneratorShell } from "@/components/ui/GeneratorShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type HistoryItem, clearHistory, getHistory } from "@/lib/history";
import {
  ClockIcon,
  ImageIcon,
  MessageSquareIcon,
  MicIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const typeConfig = {
  image: {
    icon: ImageIcon,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    label: "Image",
  },
  video: {
    icon: VideoIcon,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    label: "Video",
  },
  voice: {
    icon: MicIcon,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Voice",
  },
  chat: {
    icon: MessageSquareIcon,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    label: "Chat",
  },
};

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>(() => getHistory());

  const handleClear = useCallback(() => {
    clearHistory();
    setItems([]);
  }, []);

  return (
    <GeneratorShell
      title="Generation History"
      description="Your recent AI generations"
      icon={<ClockIcon className="h-5 w-5 text-primary" />}
    >
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {items.length} generation{items.length !== 1 ? "s" : ""}
          </p>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={handleClear}
              data-ocid="history.clear.delete_button"
            >
              <Trash2Icon className="mr-2 h-4 w-4" /> Clear History
            </Button>
          )}
        </div>

        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground"
              data-ocid="history.list.empty_state"
            >
              <ClockIcon className="h-12 w-12 opacity-20" />
              <p className="text-sm">No generation history yet</p>
              <p className="text-xs opacity-60">
                Generate some content to see your history here
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {items.map((item, idx) => {
                const cfg = typeConfig[item.type];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                    data-ocid={`history.item.${idx + 1}`}
                  >
                    <Card className="bg-card border-border hover:border-border/80 transition-colors">
                      <CardContent className="flex items-start gap-4 p-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border border-border`}
                        >
                          <Icon className={`h-5 w-5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {cfg.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(item.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground truncate">
                            {item.prompt}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0 text-muted-foreground"
                        >
                          {item.creditsUsed} cr
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </GeneratorShell>
  );
}
