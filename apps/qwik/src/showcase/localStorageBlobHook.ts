import { $, noSerialize, useSignal, useVisibleTask$, type NoSerialize, type QRL } from '@builder.io/qwik';
import localforage from 'localforage';

/**
 * Persisted blob state (IndexedDB via localforage). A File is not
 * serializable, so the signal holds it as `noSerialize`. `setFile` is a QRL,
 * usable from any event handler.
 */
export function useLocalStorageBlob(key: string) {
  const file = useSignal<NoSerialize<File> | null>(null);

  useVisibleTask$(
    () => {
      localforage
        .getItem<File>(key)
        .then((item) => {
          if (item) file.value = noSerialize(item);
        })
        .catch((error) => console.error(error));
    },
    { strategy: 'document-ready' },
  );

  const setFile: QRL<(next: File | null) => void> = $((next) => {
    file.value = next ? noSerialize(next) : null;
    localforage.setItem(key, next).catch((error) => console.error(error));
  });

  return { file, setFile };
}
