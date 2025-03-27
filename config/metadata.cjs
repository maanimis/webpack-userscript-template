const {
  name,
  author,
  dependencies,
  repository,
  version,
  description
} = require("../package.json");

module.exports = {
  name: {
    $: name,
  },
  namespace: "Violentmonkey Scripts",
  version: version,
  author: author,
  description,
  source: repository.url,
  // 'license': 'MIT',
  match: ["*://*/"],
  require: [
    `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
  ],
  grant: ["GM.xmlHttpRequest"],
  connect: ["httpbin.org"],
  "run-at": "document-end",
};
