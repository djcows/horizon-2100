import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const GlobeApp = lazy(() => import("@/components/globe/GlobeApp"));

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Boot />;
  return (
    <Suspense fallback={<Boot />}>
      <GlobeApp />
    </Suspense>
  );
}

function Boot() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-bg text-fg">
      <div className="text-center">
        <div className="font-mono text-xs tracking-[0.35em] text-primary">HORIZON 2100</div>
        <div className="mt-3 font-sans text-2xl font-semibold">Calibrating Earth</div>
        <div className="mt-2 font-mono text-xs text-muted">physical AI takeoff · 2026–2100</div>
      </div>
    </div>
  );
}
