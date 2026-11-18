import localforage from 'localforage';
import { state } from '@fiorejs/signals';
import { GlideCanvas, Renderer, createGlide } from '@canvas-glide/fiore';
import './index.css';
import './App.css';


const tabs = [
  { renderer: Renderer.Canvas, label: 'Canvas' },
  { renderer: Renderer.Image, label: 'Image' },
  { renderer: Renderer.Html, label: 'html' },
];

const glide = createGlide();
const renderer = state<Renderer>(Renderer.Canvas);
const file = state<Blob | null>(null);

localforage.getItem<Blob>('file').then((saved) => saved && file.set(saved), console.error);

function saveFile(next: Blob | null) {
  file.set(next);
  localforage.setItem('file', next).catch(console.error);
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
  </div>,
  <div style={{ width: '100dvw', height: '100dvh', overflow: 'hidden' }}>
    <GlideCanvas glide={glide} image={file} renderer={renderer} />
  </div>,
);
