/**
 * Simple reactive state store with localStorage persistence
 */
const createStore = (initialState, persistKey = null) => {
  let state = { ...initialState };

  // Try to load from localStorage
  if (persistKey) {
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        state = { ...state, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
  }

  const subscribers = new Map();

  const saveToStorage = () => {
    if (!persistKey) return;
    try {
      localStorage.setItem(persistKey, JSON.stringify(state));
    } catch {
      // ignore
    }
  };

  const get = (key) => key ? state[key] : { ...state };

  const set = (updates) => {
    const prev = { ...state };
    state = { ...state, ...updates };
    saveToStorage();

    // Notify subscribers
    subscribers.forEach((handler, key) => {
      if (!key || key in updates) {
        handler(state[key], prev[key], state);
      }
    });
  };

  const subscribe = (key, handler) => {
    subscribers.set(key, handler);
    return () => subscribers.delete(key);
  };

  return { get, set, subscribe };
};

// App state store
const appStore = createStore({
  theme: 'dark',
  primaryColor: '#6366f1',
  borderRadius: 8,
  animSpeed: 100,
  fontSize: 16,
  reduceMotion: false,
  searchQuery: '',
}, 'ui-lab-prefs');

// Apply persisted state immediately
const initStore = () => {
  const state = appStore.get();

  // Apply theme
  document.documentElement.setAttribute('data-theme', state.theme);

  // Apply primary color
  const rgb = hexToRgb(state.primaryColor);
  if (rgb) {
    document.documentElement.style.setProperty('--color-primary', state.primaryColor);
    document.documentElement.style.setProperty('--color-primary-rgb', rgb);
  }

  // Apply border radius
  document.documentElement.style.setProperty('--radius', `${state.borderRadius}px`);

  // Apply font size
  document.documentElement.style.setProperty('--font-size-base', `${state.fontSize}px`);

  // Apply reduce motion
  if (state.reduceMotion) {
    document.documentElement.setAttribute('data-reduce-motion', '');
  }
};

const hexToRgb = (hex) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)}, ${parseInt(r[2],16)}, ${parseInt(r[3],16)}` : null;
};

initStore();

window.UI = window.UI || {};
Object.assign(window.UI, { appStore, hexToRgb });
