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
import { Textarea } from "@/components/ui/textarea";
import { useCredits } from "@/hooks/useCredits";
import { addHistory } from "@/lib/history";
import {
  AlertCircleIcon,
  DownloadIcon,
  Loader2Icon,
  VideoIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const API_BASE = "https://agentrouter.org/v1";
const API_KEY = "DEMO_KEY";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5s");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { credits, spend } = useCredits();

  async function generate() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    if (credits < 20) {
      toast.error("Not enough credits (need 20)");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    if (!spend("video")) {
      toast.error("Not enough credits");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/video/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, duration }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = (await response.json()) as {
        url?: string;
        video_url?: string;
      };
      const url = data.url ?? data.video_url;
      if (!url) throw new Error("No video returned");
      setResult(url);
      addHistory({ type: "video", prompt, creditsUsed: 20, result: url });
      toast.success("Video generated!");
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
    a.download = `ai-video-${Date.now()}.mp4`;
    a.click();
  }

  return (
    <GeneratorShell
      title="Video Generator"
      description="Generate AI videos from text descriptions"
      icon={<VideoIcon className="h-5 w-5 text-primary" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="vid-prompt" className="text-sm font-medium">
                Prompt
              </Label>
              <Textarea
                id="vid-prompt"
                placeholder="A drone shot flying over a mountain range at golden hour, cinematic slow motion..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-input border-border resize-none"
                data-ocid="video.prompt.textarea"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="video.duration.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["3s", "5s", "10s"].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-sm"
              data-ocid="video.generate.primary_button"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <VideoIcon className="mr-2 h-4 w-4" /> Generate Video (20
                  credits)
                </>
              )}
            </Button>

            {error && (
              <Alert
                variant="destructive"
                data-ocid="video.generate.error_state"
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
                  className="aspect-video rounded-xl bg-muted/40 flex flex-col items-center justify-center gap-3"
                  data-ocid="video.generate.loading_state"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Generating your video...
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                  data-ocid="video.generate.success_state"
                >
                  {/* biome-ignore lint/a11y/useMediaCaption: AI-generated video has no caption track */}
                  <video
                    src={result}
                    controls
                    className="w-full rounded-xl border border-border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border"
                    onClick={download}
                    data-ocid="video.download.button"
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" /> Download Video
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground"
                  data-ocid="video.result.empty_state"
                >
                  <VideoIcon className="h-12 w-12 opacity-20" />
                  <p className="text-sm">
                    Your generated video will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </GeneratorShell>
  );
}
