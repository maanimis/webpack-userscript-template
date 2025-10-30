export function debouncer(callback: () => void, delay: number): () => void {
  let timer: number | null = null;

  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(callback, delay);
  };
}

/* Usage:

const debounceClick = debouncer(() => console.log("Clicked!"), 300);

// Call multiple times, only last one after 300ms will run
debounceClick();
debounceClick();
debounceClick();

*/
