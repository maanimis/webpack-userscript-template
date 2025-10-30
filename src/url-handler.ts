let lastUrl = location.href;
const initializers: Record<string, () => void> = {
  "https://example.com": () => {
    console.log("Running initializer for https://example.com");
  },
};

function runInitializer() {
  const init = initializers[lastUrl];
  if (init) {
    console.log(`Matched URL target: ${lastUrl}`);
    init();
  } else {
    console.log(`No initializer found for: ${lastUrl}`);
  }
}

export function urlHandler() {
  runInitializer();
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      runInitializer();
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}
