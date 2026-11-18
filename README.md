# canvas-glide demo

One page that shows [canvas-glide](https://github.com/vrtexe/canvas-glide) in the frameworks it supports: React, Solid, Svelte, Vue, Qwik and Angular, at https://vrtexe.github.io/canvas-glide-demo/. A tab switches the framework, the toolbar opens an image and picks the renderer, and the Source button shows the code of the framework that is open.

Each framework is a small app in `apps/<framework>`, written the way that framework's adapter README shows and built with the framework's own tooling. The shell in `public/` shows the selected app in an iframe and sends it the image and the renderer, so switching frameworks keeps the same picture. `shared/README.md` describes what an app has to do.

| Framework | App | Package |
| --- | --- | --- |
| React | `apps/react` | [`@canvas-glide/react`](https://github.com/vrtexe/canvas-glide-react) |
| Solid | `apps/solid` | [`@canvas-glide/solid`](https://github.com/vrtexe/canvas-glide-solid) |
| Svelte | `apps/svelte` | [`@canvas-glide/svelte`](https://github.com/vrtexe/canvas-glide-svelte) |
| Vue | `apps/vue` | [`@canvas-glide/vue`](https://github.com/vrtexe/canvas-glide-vue) |
| Qwik | `apps/qwik` | [`@canvas-glide/qwik`](https://github.com/vrtexe/canvas-glide-qwik) |
| Angular | `apps/angular` | [`@canvas-glide/angular`](https://github.com/vrtexe/canvas-glide-angular) |
| fiorejs | `apps/fiore` | `@canvas-glide/fiore` |

`apps/fiore` is not on the site yet: `@canvas-glide/fiore` is not on npm, so the app installs it from `../../../fiore`, a sibling checkout of the adapter, and only builds in that layout. Once the package is published, the app switches to it and gets its entry back in `public/frameworks.js`.

## Build and run

```sh
npm run build    # installs each app when it has no node_modules, builds it, and assembles dist/
npm run serve    # serves dist/ at http://localhost:4400/
```

`node build.mjs react vue` rebuilds only the named apps into an existing `dist/`. For work on one app, `npm run dev` in its folder starts that framework's dev server; the app then waits for an image from the shell, so open the built site to see it with one.

`dist/` is a static site with relative paths, so it can be hosted under any path. A push to `main` builds it in GitHub Actions (`.github/workflows/pages.yml`) and deploys it to GitHub Pages; nothing built is committed.

## License

MIT
