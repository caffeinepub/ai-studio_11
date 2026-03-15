import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/useCredits";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ClockIcon,
  CoinsIcon,
  HomeIcon,
  ImageIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  MessageSquareIcon,
  MicIcon,
  SparklesIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/image", icon: ImageIcon, label: "Image" },
  { to: "/video", icon: VideoIcon, label: "Video" },
  { to: "/voice", icon: MicIcon, label: "Voice" },
  { to: "/chat", icon: MessageSquareIcon, label: "Chat" },
  { to: "/history", icon: ClockIcon, label: "History" },
] as const;

function NavItem({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isActive =
    to === "/" ? currentPath === "/" : currentPath.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      data-ocid={`nav.${label.toLowerCase()}.link`}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/15 text-primary border border-primary/20 glow-primary-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { credits } = useCredits();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center glow-primary-sm">
          <SparklesIcon className="h-4 w-4 text-primary" />
        </div>
        <span className="font-display font-700 text-base tracking-tight text-foreground">
          AI Studio
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Credits */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/40 border border-border">
          <CoinsIcon className="h-4 w-4 text-yellow-400" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Credits</div>
            <div className="text-sm font-semibold text-foreground">
              {credits}
            </div>
          </div>
        </div>
      </div>

      {/* Auth */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        {isLoggedIn ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground px-3 truncate">
              {identity.getPrincipal().toString().slice(0, 12)}...
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={clear}
              data-ocid="nav.logout.button"
            >
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full gap-2 bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            data-ocid="nav.login.button"
          >
            <LogInIcon className="h-4 w-4" />
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        )}
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { credits } = useCredits();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-sidebar sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
            <SparklesIcon className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-display font-700 text-sm tracking-tight">
            AI Studio
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CoinsIcon className="h-3.5 w-3.5 text-yellow-400" />
            <span>{credits}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(true)}
            data-ocid="nav.menu.button"
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/60 w-full cursor-default"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            />
            <motion.aside
              className="absolute left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-primary" />
                  <span className="font-display font-700 text-sm">
                    AI Studio
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpen(false)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.to}
                    {...item}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </nav>
              <div className="px-3 py-3 border-t border-sidebar-border">
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      clear();
                      setOpen(false);
                    }}
                  >
                    <LogOutIcon className="h-4 w-4" /> Sign Out
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full gap-2 bg-primary/20 border border-primary/30 text-primary"
                    onClick={() => {
                      login();
                      setOpen(false);
                    }}
                    disabled={isLoggingIn}
                  >
                    <LogInIcon className="h-4 w-4" />
                    {isLoggingIn ? "Signing in..." : "Sign In"}
                  </Button>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar border-t border-border flex">
        {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => {
          const isActive =
            to === "/" ? currentPath === "/" : currentPath.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
