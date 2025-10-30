import debug from "debug";
import type { IStorage, IStorageRepository, StorageKey } from "./types.storage";

const log = debug("app:storage:gm");

class GmRepository implements IStorageRepository {
  get<T>(key: StorageKey, defaultValue: T): T {
    const result = GM_getValue(key, defaultValue);
    log("[GET]key: %s | value: %o", key, result);
    return result;
  }

  set<T>(key: StorageKey, value: T): void {
    GM_setValue(key, value);
    log("[SET]key: %s | value: %o", key, value);
  }

  remove(key: StorageKey): void {
    GM_deleteValue(key);
    log("[DELETE]key: %s", key);
  }

  onChange(
    key: StorageKey,
    callback: VMScriptGMValueChangeCallback<IStorage[StorageKey]>,
  ): void {
    GM_addValueChangeListener(key, callback);
    log("GM_addValueChangeListener: %s", key);
  }
}

const gmRepository = new GmRepository();

export { gmRepository };
