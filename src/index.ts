import debug from "debug";
import Queue from "yocto-queue";
import { DebugModeHandler } from "./debug-handler";
import { MenuKey, menuCommandService } from "./menu";
import { urlHandler } from "./url-handler";

const log = debug("app:main");

function registerMenuCommands() {
  menuCommandService.register(MenuKey.debugMode, () => {
    DebugModeHandler.init().toggle();
    alert(
      `Debug mode is ${DebugModeHandler.isDebugModeEnable() ? "ON" : "OFF"}`,
    );
  });

  menuCommandService.register(MenuKey.sayHello, () => {
    alert("Hello from TabBridge!");
  });
}

async function main() {
  log("running...");
  urlHandler();
  registerMenuCommands();

  const queue = new Queue<string>();
  queue.enqueue("🦄");
  queue.enqueue("🌈");
  console.log(queue.dequeue());
  console.log(queue.dequeue());
}

main().catch((e) => {
  log(e);
});
