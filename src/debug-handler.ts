import debug from "debug";
import { Config } from "./config";
import { gmRepository, StorageKeys } from "./storage";

export const DebugModeHandler = {
  init() {
    localStorage.debug = "app:*";
    if (this.isDebugModeEnable()) {
      debug.enable("*");
    } else {
      debug.disable();
    }
    return this;
  },

  isDebugModeEnable() {
    return gmRepository.get(StorageKeys.debugMode, Config.debugMode);
  },

  toggle() {
    if (debug.enabled("*")) {
      this.setOFF();
    } else {
      this.setON();
    }
    return this;
  },

  setON() {
    gmRepository.set(StorageKeys.debugMode, true);
    debug.enable("*");
    return this;
  },

  setOFF() {
    gmRepository.set(StorageKeys.debugMode, false);
    debug.disable();
    return this;
  },
};
