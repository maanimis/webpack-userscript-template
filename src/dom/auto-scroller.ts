export const AutoScroller = {
  scrollToTop(): void {
    window.scrollTo(0, 0);
  },

  scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  },

  scrollTo(selector: string): void {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  },
};

/* Usage:
AutoScroller.scrollToTop();
AutoScroller.scrollToBottom();
AutoScroller.scrollTo('#specific-element');
*/
