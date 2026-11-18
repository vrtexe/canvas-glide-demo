<script lang="ts">
  import './App.css';
  import { Glide, GlideCanvas, Renderer } from '@canvas-glide/svelte';
  import { createLocalStorageBlob } from './showcase/localStorageBlob.svelte';

  type Tab = (typeof Tab)[keyof typeof Tab];
  const Tab = Object.freeze({
    Canvas: 'canvas',
    Img: 'img',
    Html: 'html',
  } as const);
  const TabValues: Tab[] = Object.values(Tab);

  const TabRendererMap: Record<Tab, Renderer> = {
    [Tab.Canvas]: Renderer.Canvas,
    [Tab.Img]: Renderer.Image,
    [Tab.Html]: Renderer.Html,
  };

  const TabLabel: Record<Tab, string> = {
    [Tab.Canvas]: 'Canvas',
    [Tab.Img]: 'Image',
    [Tab.Html]: 'html',
  };

  let tab = $state<Tab>(Tab.Canvas);
  const glide = new Glide();

  const file = createLocalStorageBlob('file');

</script>

<div class="toolbar toolbar--tabs">
  {#each TabValues as t (t)}
    <button class="tab{t === tab ? ' tab--active' : ''}" onclick={() => (tab = t)}>
      {TabLabel[t]}
    </button>
  {/each}
</div>

<div class="toolbar-row">
  <div class="toolbar toolbar--controls">
    <button class="icon-btn" title="Zoom in" onclick={() => glide.zoomIn()}>+</button>
    <button class="icon-btn" title="Zoom out" onclick={() => glide.zoomOut()}>−</button>
    <span class="divider"></span>
    <button data-icon="center" onclick={() => glide.center()}>Center</button>
    <button data-icon="fit" onclick={() => glide.fit()}>Fit</button>
  </div>
</div>

<div style="width: 100dvw; height: 100dvh; overflow: hidden">
  <GlideCanvas {glide} renderer={TabRendererMap[tab]} image={file.current} />
</div>
