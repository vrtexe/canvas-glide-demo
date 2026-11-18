import { Component, signal } from '@angular/core';
import { GlideCanvas, Renderer } from '@canvas-glide/angular';
import localforage from 'localforage';

type Tab = 'canvas' | 'img' | 'html';

@Component({
  selector: 'app-root',
  imports: [GlideCanvas],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly tabs: { value: Tab; label: string; renderer: Renderer }[] = [
    { value: 'canvas', label: 'Canvas', renderer: Renderer.Canvas },
    { value: 'img', label: 'Image', renderer: Renderer.Image },
    { value: 'html', label: 'html', renderer: Renderer.Html },
  ];
  protected readonly tab = signal(this.tabs[0]);
  protected readonly file = signal<Blob | null>(null);

  constructor() {
    localforage.getItem<Blob>('file').then((file) => file && this.file.set(file), (error) => console.error(error));
  }


}
