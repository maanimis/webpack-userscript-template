export const StorageKeys = {
  debugMode: "debugMode",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export interface IStorage {
  [StorageKeys.debugMode]: boolean;
}

export interface IStorageRepository {
  get<T>(key: StorageKey, defaultValue: T): T;
  set<T>(key: StorageKey, value: T): void;
  remove(key: StorageKey): void;
  onChange(
    key: StorageKey,
    callback: VMScriptGMValueChangeCallback<IStorage[StorageKey]>,
  ): void;
}
