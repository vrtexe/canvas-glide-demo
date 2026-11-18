import { createSignal } from 'solid-js';
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

function App() {
  const [tab, setTab] = createSignal<Tab>(Tab.Canvas);
  const file = useLocalStorageBlob('file');
  let handleRef!: GlideCanvasRef;

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
          <button data-icon="center" onClick={() => handleRef?.center()}>Center</button>
          <button data-icon="fit" onClick={() => handleRef?.fit()}>Fit</button>
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

export default App;
