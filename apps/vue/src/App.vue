<script setup lang="ts">
import './App.css';
import { shallowRef, useTemplateRef } from 'vue';
import { GlideCanvas, Renderer } from '@canvas-glide/vue';
import { useLocalStorageBlob } from './showcase/useLocalStorageBlob.js';

type Tab = (typeof Tab)[keyof typeof Tab];
const Tab = Object.freeze({ Canvas: 'canvas', Img: 'img', Html: 'html' } as const);
const tabs: Tab[] = Object.values(Tab);
const tabRenderer: Record<Tab, Renderer> = { canvas: Renderer.Canvas, img: Renderer.Image, html: Renderer.Html };
const tabLabel: Record<Tab, string> = { canvas: 'Canvas', img: 'Image', html: 'html' };

const tab = shallowRef<Tab>(Tab.Canvas);
const viewer = useTemplateRef<InstanceType<typeof GlideCanvas>>('viewer');
const file = useLocalStorageBlob('file');

</script>

<template>
  <div class="toolbar toolbar--tabs">
    <button v-for="t in tabs" :key="t" :class="['tab', { 'tab--active': t === tab }]" @click="tab = t">
      {{ tabLabel[t] }}
    </button>
  </div>

  <div class="toolbar-row">
    <div class="toolbar toolbar--controls">
      <button class="icon-btn" title="Zoom in" @click="viewer?.zoomIn()">+</button>
      <button class="icon-btn" title="Zoom out" @click="viewer?.zoomOut()">−</button>
      <span class="divider"></span>
      <button data-icon="center" @click="viewer?.center()">Center</button>
      <button data-icon="fit" @click="viewer?.fit()">Fit</button>
    </div>
  </div>

  <div style="width: 100dvw; height: 100dvh; overflow: hidden">
    <GlideCanvas ref="viewer" :renderer="tabRenderer[tab]" :image="file" />
  </div>
</template>
