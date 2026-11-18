import localforage from 'localforage';
import { shallowRef } from 'vue';

/** The blob that the demo's header stored under `key` with localforage, or null. */
export function useLocalStorageBlob(key: string) {
  const value = shallowRef<Blob | null>(null);

  localforage
    .getItem<Blob>(key)
    .then((item) => (value.value = item))
    .catch((error) => console.error(error));

  return value;
}
