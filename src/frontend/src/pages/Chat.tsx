import { GeneratorShell } from "@/components/ui/GeneratorShell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useCredits } from "@/hooks/useCredits";
import { API_BASE, API_KEY } from "@/lib/apiConfig";
import { addHistory } from "@/lib/history";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  BotIcon,
  Loader2Icon,
  MessageSquareIcon,
  SendIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

let msgCounter = 0;
function makeMsg(role: "user" | "assistant", content: string): Message {
  msgCounter += 1;
  return { id: String(msgCounter), role, content };
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    makeMsg(
      "assistant",
      "Hello! I'm your AI assistant powered by GPT-4o. How can I help you today? I can answer questions, help with writing, brainstorm ideas, or assist with any task.",
    ),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollTrigger = useRef(0);
  const { credits, spend } = useCredits();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollTrigger.current is a stable ref value
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollTrigger.current]);

  async function send() {
    if (!input.trim() || loading) return;
    if (credits < 2) {
      toast.error("Not enough credits (need 2)");
      return;
    }

    const userMsg = makeMsg("user", input.trim());
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);
    scrollTrigger.current += 1;

    if (!spend("chat")) {
      toast.error("Not enough credits");
      setLoading(false);
      return;
    }

    try {
      const snapshot = [...messages, userMsg];
      const response = await fetch(`${API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: snapshot.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("No response received");

      setMessages((prev) => [...prev, makeMsg("assistant", content)]);
      scrollTrigger.current += 1;
      addHistory({
        type: "chat",
        prompt: userMsg.content.slice(0, 80),
        creditsUsed: 2,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Chat failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  function clearChat() {
    setMessages([makeMsg("assistant", "Chat cleared. How can I help you?")]);
    setError(null);
  }

  return (
    <GeneratorShell
      title="AI Chat"
      description="Intelligent conversations powered by GPT-4o"
      icon={<MessageSquareIcon className="h-5 w-5 text-primary" />}
    >
      <div
        className="rounded-xl border border-border bg-card flex flex-col"
        style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">GPT-4o Mini</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
            onClick={clearChat}
            data-ocid="chat.clear.button"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                  )}
                  data-ocid={`chat.message.item.${idx + 1}`}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-muted border border-border",
                    )}
                  >
                    {msg.role === "user" ? (
                      <UserIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <BotIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary/15 border border-primary/20 text-foreground rounded-tr-sm"
                        : "bg-muted/50 border border-border text-foreground rounded-tl-sm",
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
                data-ocid="chat.response.loading_state"
              >
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                  <BotIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div ref={bottomRef} />
        </ScrollArea>

        {/* Error */}
        {error && (
          <div className="px-4 py-2" data-ocid="chat.response.error_state">
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder="Message AI... (Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 min-h-[44px] max-h-32 bg-input border-border resize-none scrollbar-thin"
              data-ocid="chat.message.input"
            />
            <Button
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
              data-ocid="chat.send.primary_button"
            >
              {loading ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            2 credits per message • {credits} remaining
          </p>
        </div>
      </div>
    </GeneratorShell>
  );
}
