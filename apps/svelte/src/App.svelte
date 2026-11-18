<script lang="ts">
  import { Glide, GlideCanvas, Renderer } from '@canvas-glide/svelte';

  type DemoMessage = { type: 'canvas-glide-demo'; image: Blob | null; renderer: Renderer };

  const glide = new Glide();
  let image = $state<Blob | null>(null);
  let renderer = $state<Renderer>(Renderer.Canvas);

  $effect(() => {
    window.parent.postMessage({ type: 'canvas-glide-demo-ready' }, location.origin);
  });

  function onmessage({ origin, data }: MessageEvent<DemoMessage>) {
    if (origin !== location.origin || data?.type !== 'canvas-glide-demo') return;
    image = data.image;
    renderer = data.renderer;
  }
</script>

<svelte:window {onmessage} />

<div class="app">
  <GlideCanvas {glide} {image} {renderer} />
  <div class="toolbar">
    <button type="button" onclick={() => glide.zoomOut()}>Zoom out</button>
    <button type="button" onclick={() => glide.zoomIn()}>Zoom in</button>
    <button type="button" onclick={() => glide.fit()}>Fit</button>
    <output class="scale">{Math.round(glide.transform.scale * 100)}%</output>
  </div>
</div>
