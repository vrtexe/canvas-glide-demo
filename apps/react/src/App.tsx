import { useEffect, useRef, useState } from 'react';
import { GlideCanvas, Renderer, type GlideCanvasRef } from '@canvas-glide/react';

type DemoMessage = { type: 'canvas-glide-demo'; image: Blob | null; renderer: Renderer };

export function App() {
  const viewer = useRef<GlideCanvasRef>(null);
  const [image, setImage] = useState<Blob | null>(null);
  const [renderer, setRenderer] = useState<Renderer>(Renderer.Canvas);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const onMessage = ({ origin, data }: MessageEvent<DemoMessage>) => {
      if (origin !== location.origin || data?.type !== 'canvas-glide-demo') return;
      setImage(data.image);
      setRenderer(data.renderer);
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'canvas-glide-demo-ready' }, location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="app">
      <GlideCanvas
        ref={viewer}
        image={image}
        renderer={renderer}
        config={{ state: { onTransformChange: (transform) => setScale(transform.scale) } }}
      />
      <div className="toolbar">
        <button type="button" onClick={() => viewer.current?.zoomOut()}>Zoom out</button>
        <button type="button" onClick={() => viewer.current?.zoomIn()}>Zoom in</button>
        <button type="button" onClick={() => viewer.current?.fit()}>Fit</button>
        <output className="scale">{Math.round(scale * 100)}%</output>
      </div>
    </div>
  );
}
