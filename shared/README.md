# App contract

Every folder in `apps/` is a standalone app for one framework, built with that framework's usual tooling, and shown by the shell (`public/index.html`) in an iframe at `/<framework>/`. Each app uses the published `@canvas-glide/<framework>` package the way its README shows, so its source doubles as the usage example in the shell's Source panel.

An app must:

- Build into its own `dist/` with relative asset paths (Vite `base: './'`, Angular `--base-href ./`), so it works under any path.
- Import `../../shared/app.css` (or list it in its styles) and render this markup, in the framework's own syntax:

  ```html
  <div class="app">
    <!-- the adapter's GlideCanvas, filling .app, with the image and renderer below -->
    <div class="toolbar">
      <button type="button">Zoom out</button>
      <button type="button">Zoom in</button>
      <button type="button">Fit</button>
      <output class="scale">100%</output>
    </div>
  </div>
  ```

  The scale is `Math.round(transform.scale * 100)` followed by `%`, and follows the transform.
- Listen for `message` events whose `event.origin` is `location.origin` and whose `data.type` is `'canvas-glide-demo'`. `data.image` is a `Blob` or `null` and `data.renderer` is `'canvas'`, `'image'` or `'html'`; both replace the app's current values.
- Once it listens, post `{ type: 'canvas-glide-demo-ready' }` to `window.parent` with `location.origin` as the target origin; the shell answers with the current state.
- List the file the shell shows as source in the shell's `frameworks` table (`public/shell.js`); `build.mjs` copies it to `dist/<framework>/source.txt`.
