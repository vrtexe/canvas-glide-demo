import { createEffect, createSignal } from 'solid-js';
import './App.css';
import {
  GlideCanvas,
  Renderer,
  type GlideCanvasRef,
} from '@canvas-glide/solid';
import { useLocalStorageBlob } from './showcase/localStorageBlobHook';

type Tab = (typeof Tab)[keyof typeof Tab];
const Tab = Object.freeze({
  Canvas: 'canvas',
  Img: 'img',
  Html: 'html',
} as const);
const TabValues: Tab[] = Object.values(Tab);

const TabComponentMap: Record<Tab, Renderer> = {
  [Tab.Canvas]: Renderer.Canvas,
  [Tab.Img]: Renderer.Image,
  [Tab.Html]: Renderer.Html,
} as const;

const TabLabel: Record<Tab, string> = {
  [Tab.Canvas]: 'Canvas',
  [Tab.Img]: 'Image',
  [Tab.Html]: 'html',
} as const;

type Theme = (typeof Theme)[keyof typeof Theme];
const Theme = Object.freeze({
  Light: 'light',
  Dark: 'dark',
  Auto: 'auto',
} as const);

const themeOptions: { value: Theme; label: string }[] = [
  { value: Theme.Auto, label: 'Auto' },
  { value: Theme.Light, label: 'Light' },
  { value: Theme.Dark, label: 'Dark' },
];

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  if (saved === Theme.Light || saved === Theme.Dark || saved === Theme.Auto)
    return saved;
  return Theme.Auto;
}

function App() {
  const [tab, setTab] = createSignal<Tab>(Tab.Canvas);
  const [file, setFile] = useLocalStorageBlob<File | null>('file', null);
  const [theme, setTheme] = createSignal<Theme>(getInitialTheme());
  const [themeOpen, setThemeOpen] = createSignal(false);
  let uploadRef!: HTMLInputElement;
  let themeRef!: HTMLDivElement;
  let handleRef!: GlideCanvasRef;

  createEffect(() => {
    const th = theme();
    if (th === Theme.Auto) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', th);
    }
    localStorage.setItem('theme', th);
  });

  async function upload(next: File | null) {
    setFile(next);
  }

  function updateTab(tab: Tab) {
    setTab(tab);
  }

  return (
    <>
      <div class="toolbar toolbar--tabs">
        {TabValues.map((t) => (
          // key={`tab-button-${t}`}
          <button
            class={`tab${t === tab() ? ' tab--active' : ''}`}
            onClick={() => updateTab(t)}>
            {TabLabel[t]}
          </button>
        ))}
      </div>

      <div class="toolbar-row">
        <div class="toolbar toolbar--controls">
          <button
            class="icon-btn"
            title="Zoom in"
            onClick={() => handleRef?.zoomIn()}>
            +
          </button>
          <button
            class="icon-btn"
            title="Zoom out"
            onClick={() => handleRef?.zoomOut()}>
            −
          </button>
          <span class="divider" />
          <button onClick={() => handleRef?.center()}>Center</button>
          <button onClick={() => handleRef?.fit()}>Fit</button>
          <span class="divider" />
          <label class="upload-btn">
            Upload
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              onChange={(e) => upload(e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            onClick={() => {
              uploadRef!.value = '';
              upload(null);
            }}>
            ✕
          </button>
        </div>

        <div class="toolbar toolbar--theme">
          <div class="dropdown" ref={themeRef}>
            <button
              class="dropdown-trigger"
              aria-haspopup="listbox"
              aria-expanded={themeOpen()}
              onClick={() => setThemeOpen((o) => !o)}>
              <span class="dropdown-value">
                <ThemeIcon theme={theme()} />
                <span class="dropdown-label">
                  {themeOptions.find((o) => o.value === theme())?.label}
                </span>
              </span>
              <svg
                class="dropdown-caret"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {themeOpen() && (
              <ul class="dropdown-menu" role="listbox">
                {themeOptions.map((opt) => (
                  <li role="none">
                    <button
                      role="option"
                      aria-selected={theme() === opt.value}
                      class={`dropdown-item${
                        theme() === opt.value ? ' dropdown-item--active' : ''
                      }`}
                      onClick={() => {
                        setTheme(opt.value);
                        setThemeOpen(false);
                      }}>
                      <ThemeIcon theme={opt.value} />
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div style={{ width: '100dvw', height: '100dvh', overflow: 'hidden' }}>
        <GlideCanvas
          ref={handleRef}
          renderer={TabComponentMap[tab()]}
          image={file()}
        />
      </div>
    </>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (theme === Theme.Light) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    );
  }
  if (theme === Theme.Dark) {
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export default App;
