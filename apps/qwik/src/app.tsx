import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import "./app.css";
import { GlideCanvas, Renderer, useGlide } from "@canvas-glide/qwik";
import { useLocalStorageBlob } from "./showcase/localStorageBlobHook.ts";

type Tab = (typeof Tab)[keyof typeof Tab];
const Tab = Object.freeze({
  Canvas: "canvas",
  Img: "img",
  Html: "html",
} as const);
const TabValues: Tab[] = Object.values(Tab);

const TabRendererMap: Record<Tab, Renderer> = {
  [Tab.Canvas]: Renderer.Canvas,
  [Tab.Img]: Renderer.Image,
  [Tab.Html]: Renderer.Html,
} as const;

const TabLabel: Record<Tab, string> = {
  [Tab.Canvas]: "Canvas",
  [Tab.Img]: "Image",
  [Tab.Html]: "html",
} as const;

type Theme = (typeof Theme)[keyof typeof Theme];
const Theme = Object.freeze({
  Light: "light",
  Dark: "dark",
  Auto: "auto",
} as const);

const themeOptions: { value: Theme; label: string }[] = [
  { value: Theme.Auto, label: "Auto" },
  { value: Theme.Light, label: "Light" },
  { value: Theme.Dark, label: "Dark" },
];

export const App = component$(() => {
  const tab = useSignal<Tab>(Tab.Canvas);
  const theme = useSignal<Theme>(Theme.Auto);
  const themeOpen = useSignal(false);
  const uploadRef = useSignal<HTMLInputElement>();
  const glide = useGlide();
  const { file, setFile } = useLocalStorageBlob("file");

  // Restore the persisted theme, then mirror every change to the DOM +
  // localStorage. Registration order matters: the restore task runs first, so
  // the mirror task's initial run already sees the stored value.
  useVisibleTask$(
    () => {
      const saved = localStorage.getItem("theme");
      if (saved === Theme.Light || saved === Theme.Dark || saved === Theme.Auto) theme.value = saved;
    },
    { strategy: "document-ready" },
  );

  useVisibleTask$(
    ({ track }) => {
      const th = track(theme);
      if (th === Theme.Auto) {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", th);
      }
      localStorage.setItem("theme", th);
    },
    { strategy: "document-ready" },
  );

  return (
    <>
      <div class="toolbar toolbar--tabs">
        {TabValues.map((t) => (
          <button
            key={`tab-button-${t}`}
            class={`tab${t === tab.value ? " tab--active" : ""}`}
            onClick$={() => (tab.value = t)}
          >
            {TabLabel[t]}
          </button>
        ))}
      </div>

      <div class="toolbar-row">
        <div class="toolbar toolbar--controls">
          <button class="icon-btn" title="Zoom in" onClick$={() => glide.zoomIn$()}>
            +
          </button>
          <button class="icon-btn" title="Zoom out" onClick$={() => glide.zoomOut$()}>
            −
          </button>
          <span class="divider" />
          <button onClick$={() => glide.center$()}>Center</button>
          <button onClick$={() => glide.fit$()}>Fit</button>
          <span class="divider" />
          <label class="upload-btn">
            Upload
            <input ref={uploadRef} type="file" accept="image/*" onChange$={(_, el) => setFile(el.files?.[0] ?? null)} />
          </label>
          <button
            onClick$={() => {
              if (uploadRef.value) uploadRef.value.value = "";
              setFile(null);
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
              aria-expanded={themeOpen.value}
              onClick$={() => (themeOpen.value = !themeOpen.value)}
            >
              <span class="dropdown-value">
                <ThemeIcon theme={theme.value} />
                <span class="dropdown-label">{themeOptions.find((o) => o.value === theme.value)?.label}</span>
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
            {themeOpen.value && (
              <ul class="dropdown-menu" role="listbox">
                {themeOptions.map((opt) => (
                  <li key={opt.value} role="none">
                    <button
                      role="option"
                      aria-selected={theme.value === opt.value}
                      class={`dropdown-item${theme.value === opt.value ? " dropdown-item--active" : ""}`}
                      onClick$={() => {
                        theme.value = opt.value;
                        themeOpen.value = false;
                      }}
                    >
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

      <div style={{ width: "100dvw", height: "100dvh", overflow: "hidden" }}>
        <GlideCanvas glide={glide} renderer={TabRendererMap[tab.value]} image={file.value ?? null} />
      </div>
    </>
  );
});

// Inline component (no hooks) — renders within the caller, no lazy boundary.
const ThemeIcon = ({ theme }: { theme: Theme }) => {
  if (theme === Theme.Light) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    );
  }
  if (theme === Theme.Dark) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
};
