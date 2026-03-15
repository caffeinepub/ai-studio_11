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
  ImageIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const API_BASE = "https://agentrouter.org/v1";
const API_KEY = "DEMO_KEY";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { credits, spend } = useCredits();

  async function generate() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    if (credits < 10) {
      toast.error("Not enough credits");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    if (!spend("image")) {
      toast.error("Not enough credits");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/images/generations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, style, size, n: 1 }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = (await response.json()) as {
        data?: Array<{ url?: string; b64_json?: string }>;
      };
      const url =
        (data.data?.[0]?.url ?? data.data?.[0]?.b64_json)
          ? `data:image/png;base64,${data.data[0].b64_json}`
          : null;

      if (!url) throw new Error("No image returned");
      setResult(url);
      addHistory({ type: "image", prompt, creditsUsed: 10, result: url });
      toast.success("Image generated!");
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
    a.download = `ai-image-${Date.now()}.png`;
    a.click();
  }

  return (
    <GeneratorShell
      title="Image Generator"
      description="Create stunning AI images from text prompts"
      icon={<ImageIcon className="h-5 w-5 text-primary" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="img-prompt" className="text-sm font-medium">
                Prompt
              </Label>
              <Textarea
                id="img-prompt"
                placeholder="A futuristic city at sunset, neon lights reflecting on wet streets, cyberpunk aesthetic..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-input border-border resize-none"
                data-ocid="image.prompt.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger
                    className="bg-input border-border"
                    data-ocid="image.style.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Realistic", "Anime", "Cartoon", "Cinematic"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger
                    className="bg-input border-border"
                    data-ocid="image.size.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["512x512", "1024x1024"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-sm"
              data-ocid="image.generate.primary_button"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" /> Generate Image (10
                  credits)
                </>
              )}
            </Button>

            {error && (
              <Alert
                variant="destructive"
                data-ocid="image.generate.error_state"
              >
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-square rounded-xl bg-muted/40 flex flex-col items-center justify-center gap-3"
                  data-ocid="image.generate.loading_state"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Generating your image...
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                  data-ocid="image.generate.success_state"
                >
                  <img
                    src={result}
                    alt="Generated"
                    className="w-full rounded-xl border border-border"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border"
                      onClick={download}
                      data-ocid="image.download.button"
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border"
                      onClick={generate}
                      disabled={loading}
                      data-ocid="image.regenerate.button"
                    >
                      <RefreshCwIcon className="mr-2 h-4 w-4" /> Regenerate
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted-foreground"
                  data-ocid="image.result.empty_state"
                >
                  <ImageIcon className="h-12 w-12 opacity-20" />
                  <p className="text-sm">
                    Your generated image will appear here
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
