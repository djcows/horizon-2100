import type { ErrorComponentProps } from "@tanstack/react-router";

export function AppErrorComponent({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : error ? String(error) : "Unknown fault";
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-bg px-6 text-fg">
      <div className="font-mono text-xs tracking-[0.35em] text-primary">HORIZON 2100</div>
      <h1 className="mt-4 font-sans text-2xl font-semibold">Signal lost</h1>
      <p className="mt-2 max-w-md text-center font-mono text-xs text-muted">{message}</p>
      {typeof reset === "function" ? (
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg border border-border bg-surface px-4 py-2 font-mono text-xs text-primary"
        >
          REACQUIRE
        </button>
      ) : null}
    </div>
  );
}
