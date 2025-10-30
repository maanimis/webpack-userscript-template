export const FormFiller = {
  fillInput(input: HTMLInputElement, value: string): void {
    if (input) {
      input.value = value;
      this.triggerEvents(input);
    }
  },

  fillTextArea(textArea: HTMLTextAreaElement, value: string): void {
    if (textArea) {
      textArea.value = value;
      this.triggerEvents(textArea);
    }
  },

  checkCheckbox(checkbox: HTMLInputElement, checked: boolean): void {
    if (checkbox) {
      checkbox.checked = checked;
      this.triggerEvents(checkbox);
    }
  },

  selectOption(select: HTMLSelectElement, value: string): void {
    if (select) {
      select.value = value;
      this.triggerEvents(select);
    }
  },

  triggerEvents(element: HTMLElement): void {
    this.dispatchEvent(element, "input");
    this.dispatchEvent(element, "change");
    this.dispatchEvent(element, "blur");
  },

  dispatchEvent(element: HTMLElement, type: string): void {
    const event = new Event(type, { bubbles: true });
    element.dispatchEvent(event);
  },
};

/* Usage:
// Assume your HTML has:
// <input id="myInput" type="text">
// <textarea id="myTextArea"></textarea>
// <input id="myCheckbox" type="checkbox">
// <select id="mySelect">
//   <option value="1">One</option>
//   <option value="2">Two</option>
// </select>

// 1. Fill a text input
const input = document.querySelector<HTMLInputElement>("#myInput")!;
FormFiller.fillInput(input, "Hello Input");

// 2. Fill a textarea
const textArea = document.querySelector<HTMLTextAreaElement>("#myTextArea")!;
FormFiller.fillTextArea(textArea, "Hello TextArea");

// 3. Check/uncheck a checkbox
const checkbox = document.querySelector<HTMLInputElement>("#myCheckbox")!;
FormFiller.checkCheckbox(checkbox, true);  // check
FormFiller.checkCheckbox(checkbox, false); // uncheck

// 4. Select an option in a select element
const select = document.querySelector<HTMLSelectElement>("#mySelect")!;
FormFiller.selectOption(select, "2");  // selects the option with value "2"

// 5. The triggerEvents method automatically fires the 'input', 'change', and 'blur' events
// So all event listeners on the form elements will react as if the user interacted with them

*/
