import { GeneratorShell } from "@/components/ui/GeneratorShell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useCredits } from "@/hooks/useCredits";
import { API_BASE, API_KEY } from "@/lib/apiConfig";
import { addHistory } from "@/lib/history";
import {
  AlertCircleIcon,
  DownloadIcon,
  Loader2Icon,
  MicIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;
type Voice = (typeof VOICES)[number];

export default function VoiceGenerator() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<Voice>("alloy");
  const [speed, setSpeed] = useState([1.0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { credits, spend } = useCredits();

  async function generate() {
    if (!text.trim()) {
      toast.error("Please enter text");
      return;
    }
    if (credits < 5) {
      toast.error("Not enough credits (need 5)");
      return;
    }

    setLoading(true);
    setError(null);
    if (result) URL.revokeObjectURL(result);
    setResult(null);

    if (!spend("voice")) {
      toast.error("Not enough credits");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/audio/speech`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice,
          speed: speed[0],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);
      addHistory({
        type: "voice",
        prompt: text.slice(0, 80),
        creditsUsed: 5,
        result: url,
      });
      toast.success("Audio generated!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `ai-audio-${Date.now()}.mp3`;
    a.click();
  }

  return (
    <GeneratorShell
      title="Voice Generator"
      description="Convert text to natural AI speech"
      icon={<MicIcon className="h-5 w-5 text-primary" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="voice-text" className="text-sm font-medium">
                Text to speak
              </Label>
              <Textarea
                id="voice-text"
                placeholder="Welcome to AI Studio. This is an example of our advanced text-to-speech technology..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[140px] bg-input border-border resize-none"
                data-ocid="voice.text.textarea"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Voice</Label>
              <Select value={voice} onValueChange={(v) => setVoice(v as Voice)}>
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="voice.voice.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES.map((v) => (
                    <SelectItem key={v} value={v} className="capitalize">
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Speed</Label>
                <span className="text-sm text-muted-foreground">
                  {speed[0].toFixed(1)}x
                </span>
              </div>
              <Slider
                min={0.5}
                max={2.0}
                step={0.1}
                value={speed}
                onValueChange={setSpeed}
                className="w-full"
                data-ocid="voice.speed.input"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5x</span>
                <span>2.0x</span>
              </div>
            </div>

            <Button
              onClick={generate}
              disabled={loading || !text.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-sm"
              data-ocid="voice.generate.primary_button"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <MicIcon className="mr-2 h-4 w-4" /> Generate Voice (5
                  credits)
                </>
              )}
            </Button>

            {error && (
              <Alert
                variant="destructive"
                data-ocid="voice.generate.error_state"
              >
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-48 rounded-xl bg-muted/40 flex flex-col items-center justify-center gap-3"
                  data-ocid="voice.generate.loading_state"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-primary rounded-full"
                        animate={{ height: ["8px", "32px", "8px"] }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Synthesizing speech...
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                  data-ocid="voice.generate.success_state"
                >
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    {/* biome-ignore lint/a11y/useMediaCaption: AI-generated speech has no caption track */}
                    <audio controls src={result} className="w-full" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border"
                    onClick={download}
                    data-ocid="voice.download.button"
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" /> Download Audio
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-48 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground"
                  data-ocid="voice.result.empty_state"
                >
                  <MicIcon className="h-10 w-10 opacity-20" />
                  <p className="text-sm">Your audio will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </GeneratorShell>
  );
}
