import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // @canvas-glide/fiore is linked from ../../../fiore until it is on npm; one copy of fiorejs and its signals.
  resolve: { dedupe: ['fiorejs', '@fiorejs/signals'] },
});
