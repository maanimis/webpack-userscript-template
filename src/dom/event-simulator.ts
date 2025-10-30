export class EventSimulator<T extends Element = HTMLElement> {
  constructor(public element: T) {
    if (!(element instanceof Element)) {
      throw new TypeError("EventSimulator requires a valid DOM Element.");
    }
    this.element = element;
  }

  click(options = {}) {
    this._dispatchMouseEvent("click", { button: 0, buttons: 1, ...options });
    return this;
  }

  contextMenu(options = {}) {
    this._dispatchMouseEvent("contextmenu", {
      button: 2,
      buttons: 2,
      ...options,
    });
    return this;
  }

  focusIn(options = {}) {
    this._dispatchFocusEvent("focusin", options);
    return this;
  }

  focusOut(options = {}) {
    this._dispatchFocusEvent("focusout", options);
    return this;
  }

  input(value = "", options = {}) {
    if ("value" in this.element) {
      this.element.value = value;
    }
    this._dispatchBasicEvent("input", options);
    return this;
  }

  dispatch(type: string, options = {}) {
    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
      ...options,
    });
    this.element.dispatchEvent(event);
    return this;
  }

  private _dispatchMouseEvent(type: string, options = {}) {
    const defaults = {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0,
      buttons: 1,
      clientX: this.getCenterX(),
      clientY: this.getCenterY(),
    };
    const event = new MouseEvent(type, { ...defaults, ...options });
    this.element.dispatchEvent(event);
  }

  private _dispatchFocusEvent(type: string, options = {}) {
    const defaults = {
      bubbles: true,
      cancelable: true,
      relatedTarget: null,
    };
    const event = new FocusEvent(type, { ...defaults, ...options });
    this.element.dispatchEvent(event);
  }

  private _dispatchBasicEvent(type: string, options = {}) {
    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
      ...options,
    });
    this.element.dispatchEvent(event);
  }

  getCenterX(): number {
    const rect = this.element.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  getCenterY(): number {
    const rect = this.element.getBoundingClientRect();
    return rect.top + rect.height / 2;
  }
}

/* Usage:
// Assume there is a button and input in your HTML:
// <button id="myButton">Click me</button>
// <input id="myInput" type="text">

// 1. Create an EventSimulator for a button
const button = document.querySelector<HTMLButtonElement>("#myButton")!;
const buttonSimulator = new EventSimulator(button);

// Simulate a single click
buttonSimulator.click();

// Simulate a right-click (context menu)
buttonSimulator.contextMenu();

// Simulate focus in and focus out
buttonSimulator.focusIn();
buttonSimulator.focusOut();

// Chain events
buttonSimulator.click().contextMenu().focusIn();

// 2. Create an EventSimulator for an input element
const input = document.querySelector<HTMLInputElement>("#myInput")!;
const inputSimulator = new EventSimulator(input);

// Simulate typing text
inputSimulator.input("Hello World");

// Simulate focus in, typing, and then focus out
inputSimulator.focusIn().input("Typed text").focusOut();

// 3. Dispatch a custom event
buttonSimulator.dispatch("custom-event", { detail: { info: "test" } });

// 4. Access the element’s center coordinates
console.log("Button center X:", buttonSimulator.getCenterX());
console.log("Button center Y:", buttonSimulator.getCenterY());
*/
