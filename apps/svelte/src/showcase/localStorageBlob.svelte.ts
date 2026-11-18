import localforage from 'localforage';

/** The blob that the demo's header stored under `key` with localforage, as reactive `current`. Call during component init. */
export function createLocalStorageBlob(key: string) {
  let value = $state<Blob | null>(null);

  localforage
    .getItem<Blob>(key)
    .then((item) => (value = item))
    .catch((error) => console.error(error));

  return {
    get current() {
      return value;
    },
  };
}
