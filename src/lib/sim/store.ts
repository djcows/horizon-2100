import { create } from "zustand";
import { BASE_DURATION_SEC, END_YEAR, START_YEAR, YEAR_SPAN } from "./projections";

type Focus = { lat: number; lon: number; name: string } | null;

type SimState = {
  year: number;
  playing: boolean;
  speed: number;
  finished: boolean;
  focus: Focus;
  interacting: boolean;
  infoOpen: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setYear: (y: number) => void;
  setSpeed: (s: number) => void;
  tick: (dt: number) => void;
  setFocus: (f: Focus) => void;
  setInteracting: (b: boolean) => void;
  setInfoOpen: (b: boolean) => void;
  replay: () => void;
};

export const useSim = create<SimState>((set, get) => ({
  year: START_YEAR,
  playing: true,
  speed: 1,
  finished: false,
  focus: null,
  interacting: false,
  infoOpen: false,
  play: () => set({ playing: true, finished: false }),
  pause: () => set({ playing: false }),
  toggle: () => {
    const { playing, finished } = get();
    if (finished) {
      set({ year: START_YEAR, playing: true, finished: false });
      return;
    }
    set({ playing: !playing });
  },
  setYear: (y) => {
    const year = Math.min(END_YEAR, Math.max(START_YEAR, y));
    set({ year, finished: year >= END_YEAR, playing: year >= END_YEAR ? false : get().playing });
  },
  setSpeed: (s) => set({ speed: s }),
  tick: (dt) => {
    const { playing, speed, year } = get();
    if (!playing) return;
    const yearsPerSec = (YEAR_SPAN / BASE_DURATION_SEC) * speed;
    const next = year + dt * yearsPerSec;
    if (next >= END_YEAR) set({ year: END_YEAR, playing: false, finished: true });
    else set({ year: next });
  },
  setFocus: (focus) => set({ focus }),
  setInteracting: (interacting) => set({ interacting }),
  setInfoOpen: (infoOpen) => set({ infoOpen }),
  replay: () => set({ year: START_YEAR, playing: true, finished: false, focus: null }),
}));
