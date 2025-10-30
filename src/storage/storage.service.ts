import { gmRepository } from "./gm.repository";
import type { IStorage, IStorageRepository, StorageKey } from "./types.storage";

export class StorageService {
  private _service: IStorageRepository;

  constructor(service: IStorageRepository) {
    this._service = service;
  }

  setItem<T>(key: StorageKey, value: T) {
    this._service.set(key, value);
  }

  getItem<T>(key: StorageKey, defaultValue: T): T {
    return this._service.get(key, defaultValue);
  }

  removeItem(key: StorageKey) {
    this._service.remove(key);
  }

  onChange(
    key: StorageKey,
    callback: VMScriptGMValueChangeCallback<IStorage[StorageKey]>,
  ): void {
    if ("onChange" in this._service) {
      this._service.onChange(key, callback);
    }
  }

  switchService(service: IStorageRepository) {
    this._service = service;
  }
}

export const storageService = new StorageService(gmRepository);
