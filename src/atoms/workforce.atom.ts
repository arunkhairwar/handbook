import * as SecureStore from "expo-secure-store";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { Workforce } from "../types/worker.types";
import { StorageKeys } from "../storage/secure-storage";

/**
 * A jotai-compatible JSON storage adapter backed by expo-secure-store.
 * expo-secure-store is synchronous-style for reading (getItemSync) but
 * jotai/utils also supports the async interface.
 */
const secureJSONStorage = createJSONStorage<Workforce | null>(() => ({
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}));

/**
 * Persisted atom that stores the contractor's workforce.
 * Written after POST /workforces succeeds, read on every app launch.
 * This avoids needing a GET /workforces/mine endpoint.
 */
export const workforceAtom = atomWithStorage<Workforce | null>(
  StorageKeys.WORKFORCE,
  null,
  secureJSONStorage
);
