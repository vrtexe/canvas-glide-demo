import localforage from 'localforage';
import { effect, state } from '@fiorejs/signals';
import { GlideCanvas, Renderer, createGlide } from '@canvas-glide/fiore';
import './index.css';
import './App.css';

type Theme = 'light' | 'dark' | 'auto';

const tabs = [
  { renderer: Renderer.Canvas, label: 'Canvas' },
  { renderer: Renderer.Image, label: 'Image' },
  { renderer: Renderer.Html, label: 'html' },
];

const themes: { value: Theme; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const glide = createGlide();
const renderer = state<Renderer>(Renderer.Canvas);
const file = state<Blob | null>(null);
const theme = state<Theme>(initialTheme());
const themeOpen = state(false);

localforage.getItem<Blob>('file').then((saved) => saved && file.set(saved), console.error);

function saveFile(next: Blob | null) {
  file.set(next);
  localforage.setItem('file', next).catch(console.error);
}

function initialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  return saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto';
}

effect(() => {
  const value = theme.get();
  if (value === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = value;
  localStorage.setItem('theme', value);
});

function ThemeIcon(props: { theme: Theme }) {
  const common = {
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  } as const;
  if (props.theme === 'light') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    );
  }
  if (props.theme === 'dark') {
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

const upload = (
  <input type="file" accept="image/*" onchange={(event) => saveFile(event.currentTarget.files?.[0] ?? null)} />
) as HTMLInputElement;

document.querySelector('#root')!.append(
  <div class="toolbar toolbar--tabs">
    {tabs.map((tab) => (
      <button
        class={renderer.computed((current) => (current === tab.renderer ? 'tab tab--active' : 'tab'))}
        onclick={() => renderer.set(tab.renderer)}
      >
        {tab.label}
      </button>
    ))}
  </div>,
  <div class="toolbar-row">
    <div class="toolbar toolbar--controls">
      <button class="icon-btn" title="Zoom in" onclick={glide.zoomIn}>
        +
      </button>
      <button class="icon-btn" title="Zoom out" onclick={glide.zoomOut}>
        −
      </button>
      <span class="divider" />
      <button onclick={glide.center}>Center</button>
      <button onclick={glide.fit}>Fit</button>
      <span class="divider" />
      <label class="upload-btn">
        Upload
        {upload}
      </label>
      <button
        onclick={() => {
          upload.value = '';
          saveFile(null);
        }}
      >
        ✕
      </button>
    </div>

    <div class="toolbar toolbar--theme">
      <div class="dropdown">
        <button
          class="dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={themeOpen}
          onclick={() => themeOpen.update((open) => !open)}
        >
          <span class="dropdown-value">
            {theme.computed((value) => (
              <>
                <ThemeIcon theme={value} />
                <span class="dropdown-label">{themes.find((option) => option.value === value)?.label}</span>
              </>
            ))}
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
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {themeOpen.if(() => (
          <ul class="dropdown-menu" role="listbox">
            {themes.map((option) => (
              <li role="none">
                <button
                  role="option"
                  aria-selected={theme.computed((value) => value === option.value)}
                  class={theme.computed((value) =>
                    value === option.value ? 'dropdown-item dropdown-item--active' : 'dropdown-item',
                  )}
                  onclick={() => {
                    theme.set(option.value);
                    themeOpen.set(false);
                  }}
                >
                  <ThemeIcon theme={option.value} />
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  </div>,
  <div style={{ width: '100dvw', height: '100dvh', overflow: 'hidden' }}>
    <GlideCanvas glide={glide} image={file} renderer={renderer} />
  </div>,
);
