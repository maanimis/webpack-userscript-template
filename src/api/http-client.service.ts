export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  // PUT: "PUT",
  // DELETE: "DELETE",
  // PATCH: "PATCH",
  // HEAD: "HEAD",
  // OPTIONS: "OPTIONS",
} as const;

export type HttpMethodKeys = (typeof HttpMethod)[keyof typeof HttpMethod];
export type RequestType = Promise<string | boolean | undefined>;
type RequestOptions = {
  headers?: Record<string, string>;
  body?: string;
};

export const defaultHeaders = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0",
};

export class HTTPClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get(
    path: string,
    headers: Record<string, string> = {},
  ): Promise<RequestType> {
    return this.request(HttpMethod.GET, path, { headers });
  }

  post(
    path: string,
    data: object,
    headers: Record<string, string> = {},
  ): Promise<RequestType> {
    return this.request(HttpMethod.POST, path, {
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify(data),
    });
  }

  private request<T = RequestType>(
    method: HttpMethodKeys,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = options.headers || {};

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        data: options.body,
        headers,
        onload: ({ status, statusText, responseText }) => {
          if (status >= 200 && status < 300) {
            resolve(responseText as T);
          } else {
            reject(new Error(`HTTP ${status}: ${statusText}`));
          }
        },
        onerror: () => reject(new Error("Network request failed")),
        ontimeout: () => reject(new Error("Request timed out")),
        onabort: () => reject(new Error("Request was aborted")),
      });
    });
  }
}

/*Usage:
const apiClient = new HTTPClient('https://api.example.com');

// GET request
apiClient.get('/users')
  .then(console.log)
  .catch(console.error);

// POST request
apiClient.post('/users', { name: 'John Doe' })
  .then(console.log)
  .catch(console.error);

*/
