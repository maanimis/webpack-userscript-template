export interface ParsedDomain {
  domain: string;
  name: string;
}

export function parseDomain(urlString: string = location.href): ParsedDomain {
  const url = new URL(urlString);
  const parts = url.hostname.split(".");

  const domainRaw = parts.slice(-2).join(".");
  const nameRaw = parts.includes("www") ? parts[1] : parts[0];

  const domain = domainRaw.toLowerCase();
  const name = nameRaw.toLowerCase();

  return { domain, name };
}

/* Usage:
const result = parseDomain("https://www.example.com/path");
console.log(result); // { domain: "example.com", name: "example" }
*/
