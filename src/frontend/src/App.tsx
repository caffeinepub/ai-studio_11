import { Layout } from "@/components/layout/Layout";
import Chat from "@/pages/Chat";
import History from "@/pages/History";
import Home from "@/pages/Home";
import ImageGenerator from "@/pages/ImageGenerator";
import VideoGenerator from "@/pages/VideoGenerator";
import VoiceGenerator from "@/pages/VoiceGenerator";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Layout />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const imageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/image",
  component: ImageGenerator,
});
const videoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/video",
  component: VideoGenerator,
});
const voiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/voice",
  component: VoiceGenerator,
});
const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: Chat,
});
const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: History,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  imageRoute,
  videoRoute,
  voiceRoute,
  chatRoute,
  historyRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

export { Outlet };
