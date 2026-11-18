import { Component, DestroyRef, computed, inject, signal, viewChild } from '@angular/core';
import { GlideCanvas, Renderer } from '@canvas-glide/angular';

interface DemoMessage {
  type: string;
  image: Blob | null;
  renderer: Renderer;
}

@Component({
  selector: 'app-root',
  imports: [GlideCanvas],
  template: `
    <div class="app">
      <glide-canvas #viewer [image]="image()" [renderer]="renderer()" />
      <div class="toolbar">
        <button type="button" (click)="viewer.glide.zoomOut()">Zoom out</button>
        <button type="button" (click)="viewer.glide.zoomIn()">Zoom in</button>
        <button type="button" (click)="viewer.glide.fit()">Fit</button>
        <output class="scale">{{ scale() }}%</output>
      </div>
    </div>
  `,
})
export class App {
  protected readonly image = signal<Blob | null>(null);
  protected readonly renderer = signal<Renderer>(Renderer.Canvas);

  private readonly viewer = viewChild.required(GlideCanvas);
  protected readonly scale = computed(() => Math.round(this.viewer().glide.transform().scale * 100));

  constructor() {
    const onMessage = ({ origin, data }: MessageEvent<DemoMessage>) => {
      if (origin !== location.origin || data?.type !== 'canvas-glide-demo') return;
      this.image.set(data.image);
      this.renderer.set(data.renderer);
    };
    window.addEventListener('message', onMessage);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('message', onMessage));
    window.parent.postMessage({ type: 'canvas-glide-demo-ready' }, location.origin);
  }
}
