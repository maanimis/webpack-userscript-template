const {
  name,
  author,
  dependencies,
  repository,
  version,
  description,
} = require("../package.json");

module.exports = {
  name: {
    $: name,
  },
  namespace: "Violentmonkey Scripts",
  version,
  author,
  description,
  source: repository.url,
  license: "MIT",
  match: ["*://*/*"],
  icon: 'https://www.google.com/s2/favicons?sz=64&domain=google.com',
  require: [
    `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
  ],
  grant: [
    "GM_setValue",
    "GM_getValue",
    "GM_deleteValue",
    "GM_addValueChangeListener",
    "GM_registerMenuCommand",
    "GM_unregisterMenuCommand",
    "GM_xmlhttpRequest",
  ],
  connect: [],
  "run-at": "document-end",
  'inject-into': 'content',
};
