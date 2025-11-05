interface Plugin {
  id: string;
  enabled: boolean;
  init(): void;
  destroy(): void;
}

export class PluginManager {
  private plugins = new Map<string, Plugin>();

  register(plugin: Plugin) {
    this.plugins.set(plugin.id, plugin);
    if (plugin.enabled) plugin.init();
  }

  enable(id: string) {
    const plugin = this.plugins.get(id);
    if (plugin && !plugin.enabled) {
      plugin.enabled = true;
      plugin.init();
    }
  }

  disable(id: string) {
    const plugin = this.plugins.get(id);
    if (plugin?.enabled) {
      plugin.enabled = false;
      plugin.destroy();
    }
  }

  list() {
    return Array.from(this.plugins.values()).map((p) => ({
      id: p.id,
      enabled: p.enabled,
    }));
  }
}

/*
class LoggerPlugin implements Plugin {
  id = "LoggerPlugin";
  enabled = true;

  init() {
    console.log("LoggerPlugin initialized");
  }

  destroy() {
    console.log("LoggerPlugin destroyed");
  }
}

const manager = new PluginManager();
const logger = new LoggerPlugin();

manager.register(logger);
manager.disable("LoggerPlugin");
manager.enable("LoggerPlugin");

console.log(manager.list());

*/
