# canvas-glide demo

One page that shows [canvas-glide](https://github.com/vrtexe/canvas-glide) in the frameworks it supports: React, Solid, Svelte, Vue, Qwik, Angular and fiorejs, at https://vrtexe.github.io/canvas-glide-demo/. The header switches the framework, uploads or removes the image and picks the theme; below it is that framework's demo, with the same toolbars in every one: renderer tabs, zoom, Center and Fit. The Source button shows the code of the demo that is open. The first visit starts with a generated sample grid.

Each framework is an app in `apps/<framework>`, built with the framework's own tooling. The shell in `public/` shows the selected app in an iframe. It keeps the image and the theme in the origin's storage, where every app reads them, so switching frameworks keeps both. `shared/README.md` describes what an app has to do.

| Framework | App | Package |
| --- | --- | --- |
| React | `apps/react` | [`@canvas-glide/react`](https://github.com/vrtexe/canvas-glide-react) |
| Solid | `apps/solid` | [`@canvas-glide/solid`](https://github.com/vrtexe/canvas-glide-solid) |
| Svelte | `apps/svelte` | [`@canvas-glide/svelte`](https://github.com/vrtexe/canvas-glide-svelte) |
| Vue | `apps/vue` | [`@canvas-glide/vue`](https://github.com/vrtexe/canvas-glide-vue) |
| Qwik | `apps/qwik` | [`@canvas-glide/qwik`](https://github.com/vrtexe/canvas-glide-qwik) |
| Angular | `apps/angular` | [`@canvas-glide/angular`](https://github.com/vrtexe/canvas-glide-angular) |
| fiorejs | `apps/fiore` | [`@canvas-glide/fiore`](https://github.com/vrtexe/canvas-glide-fiore) |


## Build and run

```sh
npm run build    # installs each app when it has no node_modules, builds it, and assembles dist/
npm run serve    # serves dist/ at http://localhost:4400/
```

`node build.mjs react vue` rebuilds only the named apps into an existing `dist/`. For work on one app, `npm run dev` in its folder starts that framework's dev server.

`dist/` is a static site with relative paths, so it can be hosted under any path. A push to `main` builds it in GitHub Actions (`.github/workflows/pages.yml`) and deploys it to GitHub Pages; nothing built is committed.

## License

MIT
