import localforage from 'localforage';
import { createSignal } from 'solid-js';

export function useLocalStorageBlob<T extends Blob | null | undefined>(
  key: string,
  initialValue: T,
) {
  const [storedValue, setStoredValue] = createSignal<T>(initialValue);

  try {
    localforage.getItem<T>(key).then((item) => {
      setStoredValue(() => (item !== null ? item : initialValue));
    });
  } catch (error) {
    console.error(error);
    setStoredValue(() => initialValue);
  }

  function setValue(value: T) {
    try {
      setStoredValue(() => value);
      localforage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  }

  return [storedValue, setValue] as const;
}
