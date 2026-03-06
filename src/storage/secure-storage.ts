import * as SecureStore from "expo-secure-store";

/**
 * Keys used for storing values in secure storage.
 * Always use these constants — never raw strings.
 */
export const StorageKeys = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_ID: "user_id",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/**
 * Store a value in secure storage.
 */
export async function setSecureValue(
  key: StorageKey,
  value: string,
): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

/**
 * Retrieve a value from secure storage.
 * Returns null if the key doesn't exist.
 */
export async function getSecureValue(key: StorageKey): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

/**
 * Delete a value from secure storage.
 */
export async function deleteSecureValue(key: StorageKey): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

/**
 * Clear all known auth-related keys from secure storage.
 * Call this on logout.
 */
export async function clearAuthStorage(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(StorageKeys.AUTH_TOKEN),
    SecureStore.deleteItemAsync(StorageKeys.REFRESH_TOKEN),
    SecureStore.deleteItemAsync(StorageKeys.USER_ID),
  ]);
}
