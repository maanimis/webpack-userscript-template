import debug from "debug";
import type { IStorage, IStorageRepository, StorageKey } from "./types.storage";

const log = debug("app:storage:session");

class SessionRepository implements IStorageRepository {
  get<T>(key: StorageKey, defaultValue: T): T {
    const item = sessionStorage.getItem(key);
    const result = item !== null ? JSON.parse(item) : defaultValue;
    log("[GET]key: %s | value: %o", key, result);
    return result;
  }

  set<T>(key: StorageKey, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
    log("[SET]key: %s | value: %o", key, value);
  }

  remove(key: keyof IStorage): void {
    sessionStorage.removeItem(key);
    log("[DELETE]key: %s", key);
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

const sessionRepository = new SessionRepository();

export { sessionRepository };
