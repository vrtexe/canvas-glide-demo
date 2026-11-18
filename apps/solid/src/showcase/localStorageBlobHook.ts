import localforage from 'localforage';
import { createSignal } from 'solid-js';

/** The blob that the demo's header stored under `key` with localforage, or null. */
export function useLocalStorageBlob(key: string) {
  const [value, setValue] = createSignal<Blob | null>(null);

  localforage.getItem<Blob>(key).then((item) => setValue(() => item), (error) => console.error(error));

  return value;
}
