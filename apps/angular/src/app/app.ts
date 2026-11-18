import { Component, effect, signal } from '@angular/core';
import { GlideCanvas, Renderer } from '@canvas-glide/angular';
import localforage from 'localforage';

type Tab = 'canvas' | 'img' | 'html';
type Theme = 'light' | 'dark' | 'auto';

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
  protected readonly themes: { value: Theme; label: string }[] = [
    { value: 'auto', label: 'Auto' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  protected readonly tab = signal(this.tabs[0]);
  protected readonly theme = signal<Theme>(this.initialTheme());
  protected readonly themeOpen = signal(false);
  protected readonly file = signal<File | null>(null);

  constructor() {
    localforage.getItem<File>('file').then((file) => file && this.file.set(file), (error) => console.error(error));
    effect(() => {
      const theme = this.theme();
      if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  protected themeLabel(value: Theme) {
    return this.themes.find((option) => option.value === value)?.label;
  }

  protected onUpload(event: Event) {
    this.saveFile((event.target as HTMLInputElement).files?.[0] ?? null);
  }

  protected clear(upload: HTMLInputElement) {
    upload.value = '';
    this.saveFile(null);
  }

  protected chooseTheme(value: Theme) {
    this.theme.set(value);
    this.themeOpen.set(false);
  }

  private saveFile(file: File | null) {
    this.file.set(file);
    localforage.setItem('file', file).catch((error) => console.error(error));
  }

  private initialTheme(): Theme {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto';
  }
}
