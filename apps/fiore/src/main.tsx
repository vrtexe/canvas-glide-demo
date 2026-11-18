import { state } from '@fiorejs/signals';
import { GlideCanvas, Renderer, createGlide } from '@canvas-glide/fiore';
import '../../../shared/app.css';

type DemoMessage = { type: 'canvas-glide-demo'; image: Blob | null; renderer: Renderer };

const glide = createGlide();
const image = state<Blob | null>(null);
const renderer = state<Renderer>(Renderer.Canvas);

window.addEventListener('message', ({ origin, data }: MessageEvent<DemoMessage>) => {
  if (origin !== location.origin || data?.type !== 'canvas-glide-demo') return;
  image.set(data.image);
  renderer.set(data.renderer);
});

document.body.append(
  <div class="app">
    <GlideCanvas glide={glide} image={image} renderer={renderer} />
    <div class="toolbar">
      <button type="button" onclick={glide.zoomOut}>Zoom out</button>
      <button type="button" onclick={glide.zoomIn}>Zoom in</button>
      <button type="button" onclick={glide.fit}>Fit</button>
      <output class="scale">{glide.transform.computed(({ scale }) => `${Math.round(scale * 100)}%`)}</output>
    </div>
  </div>,
);

window.parent.postMessage({ type: 'canvas-glide-demo-ready' }, location.origin);
