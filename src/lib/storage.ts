export type Language = 'ru' | 'kz' | 'en';
export type Theme = 'light' | 'dark';

export interface AppState {
  lang: Language;
  theme: Theme;
  progress: Record<string, boolean[]>;
  quizBest: number;
  notes: string;
  lessonLevels: Record<string, 1 | 2 | 3>;
}

// New visitors start in the light Laboratory theme; a saved theme always wins (merged on load).
const DEFAULT_STATE: AppState = {
  lang: 'ru',
  theme: 'light',
  progress: {},
  quizBest: 0,
  notes: '',
  lessonLevels: {},
};

const STORAGE_KEY = 'mathuni_state';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

export function setCookie(name: string, val: string, days = 365) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(val)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

export function loadStoredState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    // 1. Try localStorage first
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      return { ...DEFAULT_STATE, ...parsed };
    }

    // 2. Fallback to existing cookie from legacy project
    const cookieVal = getCookie(STORAGE_KEY);
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal);
      const merged = { ...DEFAULT_STATE, ...parsed };
      // Migrate to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.error('Failed to load state:', err);
  }

  return DEFAULT_STATE;
}

export function saveStoredState(state: AppState) {
  if (typeof window === 'undefined') return;

  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);

    // Also mirror essential state to cookie for backward compatibility (safe size limit)
    const cookieState = {
      lang: state.lang,
      theme: state.theme,
      progress: state.progress,
      quizBest: state.quizBest,
      notes: state.notes.slice(0, 1000), // prevent cookie overflow
    };
    setCookie(STORAGE_KEY, JSON.stringify(cookieState));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}
