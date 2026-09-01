import { useEffect } from "react";

/**
 * Handshake with the Grok App Builder live-preview host.
 * Keep mounted in `__root.tsx` — do not remove.
 */
export function PreviewHostBridge() {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      const data = event.data as { type?: string; theme?: string };
      if (data.type === "preview-theme" && typeof data.theme === "string") {
        document.documentElement.dataset.previewTheme = data.theme;
      }
    };
    window.addEventListener("message", onMessage);
    try {
      window.parent?.postMessage({ type: "preview-ready" }, "*");
    } catch {
      /* ignore cross-origin */
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return null;
}
