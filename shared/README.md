# App contract

Every folder in `apps/` is the canvas-glide demo for one framework, built with that framework's usual tooling. The shell (`public/index.html`) is a header with one tab per framework and shows the selected app in an iframe at `/<framework>/`. Each app uses the published `@canvas-glide/<framework>` package, so its source doubles as the usage example in the shell's Source panel.

All apps have the same interface, first written for the React demo: renderer tabs at the top left, zoom, Center, Fit, Upload and clear at the top right, and a theme menu. Its styles are `src/App.css` and `src/index.css` (Angular: `src/app/app.css` and `src/styles.css`), the same in every app.

An app must:

- Build into its own `dist/` with relative asset paths (Vite `base: './'`, Angular `baseHref: "./"`), so it works under any path.
- Keep the image with [localforage](https://github.com/localForage/localForage) under the key `file`, and the theme in `localStorage` under `theme` (`'auto'`, `'light'` or `'dark'`, applied as `data-theme` on `<html>`, removed for `auto`). The apps share one origin, so switching frameworks keeps both, and the shell's header follows the theme through the `storage` event.
- Be listed in `public/frameworks.js` with the file the Source panel shows; `build.mjs` builds the listed apps and copies that file to `dist/<framework>/source.txt`.
