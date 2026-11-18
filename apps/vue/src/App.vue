<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue';
import { GlideCanvas, Renderer } from '@canvas-glide/vue';

type DemoMessage = { type: 'canvas-glide-demo'; image: Blob | null; renderer: Renderer };

const viewer = useTemplateRef('viewer');
const image = shallowRef<Blob | null>(null);
const renderer = shallowRef<Renderer>(Renderer.Canvas);

function onMessage({ origin, data }: MessageEvent<DemoMessage>) {
  if (origin !== location.origin || data?.type !== 'canvas-glide-demo') return;
  image.value = data.image;
  renderer.value = data.renderer;
}

onMounted(() => {
  window.addEventListener('message', onMessage);
  window.parent.postMessage({ type: 'canvas-glide-demo-ready' }, location.origin);
});
onBeforeUnmount(() => window.removeEventListener('message', onMessage));
</script>

<template>
  <div class="app">
    <GlideCanvas ref="viewer" :image :renderer />
    <div class="toolbar">
      <button type="button" @click="viewer?.zoomOut()">Zoom out</button>
      <button type="button" @click="viewer?.zoomIn()">Zoom in</button>
      <button type="button" @click="viewer?.fit()">Fit</button>
      <output class="scale">{{ Math.round((viewer?.transform.scale ?? 1) * 100) }}%</output>
    </div>
  </div>
</template>
