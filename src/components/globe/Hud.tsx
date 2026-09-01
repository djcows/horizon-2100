"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { currentEvent } from "@/lib/sim/events";
import {
  END_YEAR,
  START_YEAR,
  eraFor,
  formatCount,
  formatGdp,
  formatYear,
  sampleDelta,
  series,
} from "@/lib/sim/projections";
import { useSim } from "@/lib/sim/store";

const SPEEDS = [1, 2, 4, 8] as const;
const TICKS = [
  { y: 2026, l: "2026" },
  { y: 2036, l: "1B" },
  { y: 2045, l: "PARITY" },
  { y: 2052, l: "PEAK U" },
  { y: 2084, l: "POP" },
  { y: 2100, l: "2100" },
];

const CINEMATIC: { y: number; t: string }[] = [
  { y: 2036, t: "ONE BILLION HUMANOIDS" },
  { y: 2045, t: "MORE ROBOTS THAN PEOPLE" },
  { y: 2100, t: "HORIZON" },
];

function useHudYear() {
  const [year, setYear] = useState(() => useSim.getState().year);
  useEffect(() => {
    let id = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 80) {
        last = t;
        setYear(useSim.getState().year);
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
  return year;
}

function Spark({ data, color, year }: { data: number[]; color: string; year: number }) {
  const i = Math.min(data.length - 1, Math.max(0, Math.floor(year) - START_YEAR));
  const slice = data.slice(0, i + 1);
  const min = Math.min(...slice);
  const max = Math.max(...slice);
  const span = max - min || 1;
  const pts = slice
    .map((v, k) => {
      const x = (k / Math.max(slice.length - 1, 1)) * 64;
      const y = 18 - ((v - min) / span) * 16;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 64 20" className="spark" aria-hidden="true">
      <polyline fill="none" stroke={color} strokeWidth="1.25" points={pts} />
    </svg>
  );
}

function fmtDelta(n: number, kind: "count" | "gdp" | "pp") {
  const sign = n > 0 ? "+" : n < 0 ? "\u2212" : "";
  const abs = Math.abs(n);
  if (kind === "pp") return `${n > 0 ? "+" : n < 0 ? "\u2212" : ""}${abs.toFixed(1)} pp`;
  if (kind === "gdp") return `${sign}${formatGdp(abs)} /yr`;
  return `${sign}${formatCount(abs)} /yr`;
}

export function Hud({ reduced }: { reduced: boolean }) {
  const year = useHudYear();
  const playing = useSim((s) => s.playing);
  const speed = useSim((s) => s.speed);
  const finished = useSim((s) => s.finished);
  const infoOpen = useSim((s) => s.infoOpen);
  const snap = sampleDelta(year);
  const { era, blurb } = eraFor(year);
  const ev = currentEvent(year);
  const ser = useMemo(() => series(), []);
  const [eventOpen, setEventOpen] = useState(false);
  const wasPlaying = useRef(true);
  const [title, setTitle] = useState<string | null>(null);
  const fired = useRef<Set<number>>(new Set());
  const progress = ((year - START_YEAR) / (END_YEAR - START_YEAR)) * 100;

  useEffect(() => {
    if (year <= START_YEAR + 0.05) fired.current.clear();
    if (reduced) return;
    for (const c of CINEMATIC) {
      if (year >= c.y && year < c.y + 0.45 && !fired.current.has(c.y)) {
        fired.current.add(c.y);
        setTitle(c.t);
        const t = window.setTimeout(() => setTitle(null), 4200);
        return () => window.clearTimeout(t);
      }
    }
  }, [year, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      const sim = useSim.getState();
      if (e.code === "Space") {
        e.preventDefault();
        sim.toggle();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        sim.setYear(sim.year - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        sim.setYear(sim.year + 1);
      } else if (e.key === "1") sim.setSpeed(1);
      else if (e.key === "2") sim.setSpeed(2);
      else if (e.key === "4") sim.setSpeed(4);
      else if (e.key === "8") sim.setSpeed(8);
      else if (e.key === "r" || e.key === "R") sim.replay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const unempRising = snap.dUnemp >= 0;

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-brand">
          <div className="hud-kicker">HORIZON 2100</div>
          <div className="hud-year-row">
            <span className="hud-year">{Math.floor(year)}</span>
            <span className="hud-month">{formatYear(year).split(" ")[0]}</span>
          </div>
          <div className="hud-era">{era}</div>
          <div className="hud-blurb">{blurb}</div>
        </div>
        <div className="hud-controls">
          <button type="button" className="hud-btn" aria-label={playing ? "Pause" : "Play"} onClick={() => useSim.getState().toggle()}>
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><rect x="2" y="2" width="4" height="10" fill="currentColor" /><rect x="8" y="2" width="4" height="10" fill="currentColor" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M3 2l10 5-10 5V2z" fill="currentColor" /></svg>
            )}
            <span>{playing ? "PAUSE" : "PLAY"}</span>
          </button>
          <div className="speed-row" role="group" aria-label="Playback speed">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${speed === s ? "chip-on" : ""}`}
                aria-pressed={speed === s}
                onClick={() => useSim.getState().setSpeed(s)}
              >
                {s}×
              </button>
            ))}
          </div>
          <button type="button" className="hud-btn" aria-label="Replay" onClick={() => useSim.getState().replay()}>
            REPLAY
          </button>
          <button type="button" className="hud-btn" aria-label="Scenario notes" onClick={() => useSim.getState().setInfoOpen(true)}>
            INFO
          </button>
        </div>
      </div>

      <div className="hud-stats">
        <Stat label="HUMANOIDS" value={formatCount(snap.robots)} delta={fmtDelta(snap.dRobots, "count")} deltaClass="d-teal" spark={<Spark data={ser.robots} color="#3ee0c5" year={year} />} />
        <Stat label="HUMANS" value={formatCount(snap.humans)} delta={fmtDelta(snap.dHumans, "count")} deltaClass={snap.dHumans >= 0 ? "d-teal" : "d-gold"} spark={<Spark data={ser.humans} color="#8b93a7" year={year} />} />
        <Stat label="UNEMPLOYMENT" value={`${snap.unemployment.toFixed(1)}%`} delta={fmtDelta(snap.dUnemp, "pp")} deltaClass={unempRising ? "d-gold" : "d-teal"} spark={<Spark data={ser.unemp} color={unempRising ? "#e8b86d" : "#3ee0c5"} year={year} />} />
        <Stat label="WORLD GDP" value={formatGdp(snap.gdp)} delta={fmtDelta(snap.dGdp, "gdp")} deltaClass="d-teal" spark={<Spark data={ser.gdp} color="#e8b86d" year={year} />} />
      </div>

      {ev ? (
        <button type="button" className={`event-card ${eventOpen ? "open" : ""}`} onClick={() => setEventOpen((v) => !v)}>
          <div className="event-kicker">SIGNAL · {Math.floor(ev.year)}</div>
          <div className="event-title">{ev.title}</div>
          <div className="event-body">{ev.body}</div>
        </button>
      ) : null}

      <div className="hud-bottom">
        <div className="timeline" style={{ ["--p" as string]: `${progress}%` }}>
          <input
            type="range"
            min={START_YEAR}
            max={END_YEAR}
            step={0.02}
            value={year}
            aria-label="Timeline year"
            onPointerDown={() => {
              wasPlaying.current = useSim.getState().playing;
              useSim.getState().pause();
            }}
            onPointerUp={() => {
              if (wasPlaying.current) useSim.getState().play();
            }}
            onChange={(e) => useSim.getState().setYear(Number(e.target.value))}
          />
          <div className="ticks">
            {TICKS.map((tk) => (
              <span key={tk.y} style={{ left: `${((tk.y - START_YEAR) / (END_YEAR - START_YEAR)) * 100}%` }}>
                {tk.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {title ? (
        <div className="cine-title" aria-live="polite">
          <div className="cine-kicker">HORIZON 2100</div>
          <div className="cine-text">{title}</div>
        </div>
      ) : null}

      {finished ? (
        <div className="horizon-overlay">
          <div className="cine-kicker">2100</div>
          <div className="horizon-word">HORIZON</div>
          <p className="horizon-sub">Eighty billion humanoids. Work is a hobby.</p>
          <button type="button" className="hud-btn hud-btn-lg" onClick={() => useSim.getState().replay()}>
            REPLAY
          </button>
        </div>
      ) : null}

      {infoOpen ? (
        <div className="info-scrim" onClick={() => useSim.getState().setInfoOpen(false)}>
          <div className="info-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="info-h">
            <div className="hud-kicker">SCENARIO</div>
            <h2 id="info-h">About this projection</h2>
            <p>
              This is a scenario, not a forecast consensus. Physical-AI takeoff aligned with Musk / Adcock:
              <strong> 1 billion humanoids by 2036</strong> — not Morgan Stanley's 2050 case.
            </p>
            <p>Humans follow UN WPP 2024 medium variant (peak ~10.3B around 2084).</p>
            <p>
              Unemployment is a 20th-century statistic under labor substitution. After peak displacement it falls because
              the measure becomes meaningless — most of the "unemployed" are not looking.
            </p>
            <p>World GDP is real 2026 USD, compounded from 24/7 robot productivity on top of a slowly growing human baseline.</p>
            <button type="button" className="hud-btn" onClick={() => useSim.getState().setInfoOpen(false)}>
              CLOSE
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  deltaClass,
  spark,
}: {
  label: string;
  value: string;
  delta: string;
  deltaClass: string;
  spark: ReactNode;
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-delta ${deltaClass}`}>{delta}</div>
      {spark}
    </div>
  );
}
