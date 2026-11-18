import { component$, useSignal } from "@builder.io/qwik";
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

export const App = component$(() => {
  const tab = useSignal<Tab>(Tab.Canvas);
  const glide = useGlide();
  const file = useLocalStorageBlob("file");

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
          <button data-icon="center" onClick$={() => glide.center$()}>Center</button>
          <button data-icon="fit" onClick$={() => glide.fit$()}>Fit</button>
        </div>
      </div>

      <div style={{ width: "100dvw", height: "100dvh", overflow: "hidden" }}>
        <GlideCanvas glide={glide} renderer={TabRendererMap[tab.value]} image={file.value ?? null} />
      </div>
    </>
  );
});
