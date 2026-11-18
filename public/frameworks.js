/**
 * The framework apps, in tab order. `file` is the source the shell shows, relative to `apps/<id>/`, highlighted as
 * `language`; `logo` is the framework's mark in `icons/` (fiorejs has none).
 */
export const frameworks = [
  { id: 'react', name: 'React', file: 'src/App.tsx', language: 'typescript', logo: 'react.svg' },
  { id: 'solid', name: 'Solid', file: 'src/App.tsx', language: 'typescript', logo: 'solidjs.svg' },
  { id: 'svelte', name: 'Svelte', file: 'src/App.svelte', language: 'xml', logo: 'svelte.svg' },
  { id: 'vue', name: 'Vue', file: 'src/App.vue', language: 'xml', logo: 'vue.svg' },
  { id: 'qwik', name: 'Qwik', file: 'src/app.tsx', language: 'typescript', logo: 'qwik.svg' },
  { id: 'angular', name: 'Angular', file: 'src/app/app.ts', language: 'typescript', logo: 'angular.svg' },
  { id: 'fiore', name: 'fiorejs', file: 'src/main.tsx', language: 'typescript' },
];
