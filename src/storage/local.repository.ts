import debug from "debug";
import type { IStorage, IStorageRepository, StorageKey } from "./types.storage";

const log = debug("app:storage:local");

class LocalStorageRepository implements IStorageRepository {
  get<T>(key: StorageKey, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      log("[GET] key: %s | default: %o", key, defaultValue);
      return defaultValue;
    }
    try {
      const value = JSON.parse(raw) as T;
      log("[GET] key: %s | value: %o", key, value);
      return value;
    } catch (e) {
      log("[GET] key: %s | parse error, returning default", key);
      log(e);
      return defaultValue;
    }
  }

  set<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      log("[SET] key: %s | value: %o", key, value);
    } catch (e) {
      log("[SET] key: %s | error saving value: %o", key, e);
    }
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(key);
    log("[DELETE] key: %s", key);
  }

  onChange(
    key: StorageKey,
    callback: VMScriptGMValueChangeCallback<IStorage[StorageKey]>,
  ): void {
    const storageHandler = (event: StorageEvent) => {
      if (event.storageArea === sessionStorage && event.key === key) {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
        callback("storage", newValue, oldValue, true);
      }
    };
    window.addEventListener("storage", storageHandler);
    log("GM_addValueChangeListener: %s", key);
  }
}

const localRepository = new LocalStorageRepository();

export { localRepository };
