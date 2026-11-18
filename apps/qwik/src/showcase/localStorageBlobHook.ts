import { noSerialize, useSignal, useVisibleTask$, type NoSerialize } from '@builder.io/qwik';
import localforage from 'localforage';

/** The blob that the demo's header stored under `key` with localforage; a Blob is not serializable, so it is held as `noSerialize`. */
export function useLocalStorageBlob(key: string) {
  const file = useSignal<NoSerialize<Blob> | null>(null);

  useVisibleTask$(
    () => {
      localforage
        .getItem<Blob>(key)
        .then((item) => (file.value = item ? noSerialize(item) : null))
        .catch((error) => console.error(error));
    },
    { strategy: 'document-ready' },
  );

  return file;
}
