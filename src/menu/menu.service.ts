import debug from "debug";
import type { IMenuCommandRepository, MenuCommand } from "./interface.menu";

const log = debug("app:menu");

class MenuCommandRepository implements IMenuCommandRepository {
  private commands = new Map<string, MenuCommand>();

  add(command: MenuCommand): void {
    this.commands.set(command.name, command);
  }

  remove(name: string): MenuCommand | undefined {
    const command = this.commands.get(name);
    if (command) {
      this.commands.delete(name);
    }
    return command;
  }

  get(name: string): MenuCommand | undefined {
    return this.commands.get(name);
  }

  getAll(): MenuCommand[] {
    return Array.from(this.commands.values());
  }

  clear(): void {
    this.commands.clear();
  }

  has(name: string): boolean {
    return Boolean(this.commands.get(name));
  }
}

class MenuCommandService {
  constructor(private _repository: IMenuCommandRepository) {}

  register(name: string, callback: () => void): MenuCommand {
    this.unregister(name);
    log("registering: %s", name);

    const id = GM_registerMenuCommand(name, callback);
    const command: MenuCommand = { id, name, callback };

    this._repository.add(command);

    return command;
  }

  unregister(name: string): void {
    const command = this._repository.remove(name);

    if (command) {
      GM_unregisterMenuCommand(command.id);
      log("unregistering: %s", name);
    }
  }

  unregisterAll(): void {
    log("unregistering all");
    this._repository.getAll().forEach((command) => {
      GM_unregisterMenuCommand(command.id);
    });

    this._repository.clear();
  }
}

const menuCommandRepository = new MenuCommandRepository();
const menuCommandService = new MenuCommandService(menuCommandRepository);

export { menuCommandService };
