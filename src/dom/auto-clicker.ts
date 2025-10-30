export const AutoClicker = {
  click(target: string | HTMLElement): void {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (element instanceof HTMLElement) {
      element.click();
    }
  },

  doubleClick(target: string | HTMLElement): void {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (element instanceof HTMLElement) {
      const mouseEvent = new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(mouseEvent);
    }
  },

  rightClick(target: string | HTMLElement): void {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;

    if (element instanceof HTMLElement) {
      const mouseEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(mouseEvent);
    }
  },
};

/* Usage:

AutoClicker.click("#myButton");
AutoClicker.click(document.body);

*/
