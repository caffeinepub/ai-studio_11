import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  GlobeIcon,
  ImageIcon,
  MessageSquareIcon,
  MicIcon,
  ShieldIcon,
  SparklesIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

const generators = [
  {
    icon: ImageIcon,
    title: "Image Generation",
    description:
      "Transform text prompts into stunning images with AI. Choose from Realistic, Anime, Cartoon, and Cinematic styles.",
    to: "/image",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    badge: "10 credits",
    ocid: "home.image.card",
  },
  {
    icon: VideoIcon,
    title: "Video Generation",
    description:
      "Create compelling AI videos from descriptive prompts. Generate 3, 5, or 10-second clips instantly.",
    to: "/video",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "20 credits",
    ocid: "home.video.card",
  },
  {
    icon: MicIcon,
    title: "Voice Generation",
    description:
      "Convert text to natural-sounding speech. Choose from 6 distinct AI voices with custom speed control.",
    to: "/voice",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: "5 credits",
    ocid: "home.voice.card",
  },
  {
    icon: MessageSquareIcon,
    title: "AI Chat",
    description:
      "Engage in intelligent conversations powered by GPT-4o. Get answers, brainstorm ideas, and create content.",
    to: "/chat",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    badge: "2 credits",
    ocid: "home.chat.card",
  },
] as const;

const features = [
  {
    icon: ZapIcon,
    title: "Lightning Fast",
    desc: "Generate content in seconds with our optimized AI pipeline.",
  },
  {
    icon: ShieldIcon,
    title: "Private & Secure",
    desc: "Your prompts and outputs are never stored on our servers.",
  },
  {
    icon: GlobeIcon,
    title: "Always Available",
    desc: "24/7 access to all generation tools from anywhere in the world.",
  },
];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section
        className="relative overflow-hidden min-h-[480px] flex items-center"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.08 0.012 282), oklch(0.08 0.012 282) 60%, oklch(0.08 0.012 282) 100%)",
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-ai-studio.dim_1600x900.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.65 0.28 292 / 0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-primary/15 text-primary border-primary/30 text-xs tracking-wider uppercase">
              <SparklesIcon className="h-3 w-3 mr-1" /> Powered by Advanced AI
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">AI Studio</span>
              <br />
              <span className="text-foreground">Generator</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Create stunning images, videos, voice, and text with the power of
              AI — all in one place.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-sm transition-all"
                data-ocid="home.start.primary_button"
              >
                <Link to="/image">
                  Start Creating <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:border-primary/50 transition-colors"
                data-ocid="home.explore.secondary_button"
              >
                <Link to="/chat">Try AI Chat</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Generator Cards */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-semibold mb-3"
          >
            Everything you need to create
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground">
            Four powerful AI tools in one unified workspace
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {generators.map(
            ({
              icon: Icon,
              title,
              description,
              to,
              color,
              bg,
              badge,
              ocid,
            }) => (
              <motion.div key={to} variants={fadeUp}>
                <Card
                  className="bg-card border-border card-hover cursor-pointer h-full"
                  data-ocid={ocid}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center ${bg}`}
                      >
                        <Icon className={`h-5 w-5 ${color}`} />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs text-muted-foreground"
                      >
                        {badge}
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {description}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full border-border hover:border-primary/50 hover:text-primary transition-all group"
                      data-ocid={`${ocid.split(".")[1]}.try_now.button`}
                    >
                      <Link to={to}>
                        Try Now
                        <ArrowRightIcon className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ),
          )}
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div
          className="rounded-2xl border border-border p-8 md:p-12"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.11 0.014 282), oklch(0.13 0.02 292))",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
