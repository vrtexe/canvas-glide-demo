import localforage from 'localforage';
import { useEffect, useState } from 'react';

/** The blob that the demo's header stored under `key` with localforage, or null. */
export function useLocalStorageBlob(key: string) {
  const [value, setValue] = useState<Blob | null>(null);

  useEffect(() => {
    localforage.getItem<Blob>(key).then(setValue, (error) => console.error(error));
  }, [key]);

  return value;
}
