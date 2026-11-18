import { createSignal, onCleanup, onMount } from 'solid-js';
import { GlideCanvas, Renderer, type GlideCanvasRef } from '@canvas-glide/solid';

type DemoMessage = { type: 'canvas-glide-demo'; image: Blob | null; renderer: Renderer };

export function App() {
  let viewer!: GlideCanvasRef;
  const [image, setImage] = createSignal<Blob | null>(null);
  const [renderer, setRenderer] = createSignal<Renderer>(Renderer.Canvas);
  const [scale, setScale] = createSignal(1);

  const onMessage = ({ origin, data }: MessageEvent<DemoMessage>) => {
    if (origin !== location.origin || data?.type !== 'canvas-glide-demo') return;
    setImage(data.image);
    setRenderer(data.renderer);
  };
  onMount(() => {
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'canvas-glide-demo-ready' }, location.origin);
  });
  onCleanup(() => window.removeEventListener('message', onMessage));

  return (
    <div class="app">
      <GlideCanvas
        ref={viewer}
        image={image()}
        renderer={renderer()}
        config={{ state: { onTransformChange: (transform) => setScale(transform.scale) } }}
      />
      <div class="toolbar">
        <button type="button" onClick={() => viewer.zoomOut()}>Zoom out</button>
        <button type="button" onClick={() => viewer.zoomIn()}>Zoom in</button>
        <button type="button" onClick={() => viewer.fit()}>Fit</button>
        <output class="scale">{Math.round(scale() * 100)}%</output>
      </div>
    </div>
  );
}
