import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { GlideCanvas, Renderer, useGlide } from '@canvas-glide/qwik';

export const App = component$(() => {
  const glide = useGlide();
  const image = useSignal<Blob | null>(null);
  const renderer = useSignal<Renderer>(Renderer.Canvas);

  useVisibleTask$(
    ({ cleanup }) => {
      const receive = ({ origin, data }: MessageEvent) => {
        if (origin !== location.origin || data?.type !== 'canvas-glide-demo') return;
        image.value = data.image;
        renderer.value = data.renderer;
      };
      window.addEventListener('message', receive);
      cleanup(() => window.removeEventListener('message', receive));
      window.parent.postMessage({ type: 'canvas-glide-demo-ready' }, location.origin);
    },
    { strategy: 'document-ready' },
  );

  return (
    <div class="app">
      <GlideCanvas glide={glide} image={image.value} renderer={renderer.value} />
      <div class="toolbar">
        <button type="button" onClick$={() => glide.zoomOut$()}>Zoom out</button>
        <button type="button" onClick$={() => glide.zoomIn$()}>Zoom in</button>
        <button type="button" onClick$={() => glide.fit$()}>Fit</button>
        <output class="scale">{Math.round(glide.transform.value.scale * 100)}%</output>
      </div>
    </div>
  );
});
