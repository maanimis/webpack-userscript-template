export function findElementsBySelectorAndTextContains<
  T extends Element = Element,
>(selector: string, text: string): T[] {
  const elements = document.querySelectorAll<T>(selector);

  return Array.from(elements).filter((el) => el.textContent?.includes(text));
}
