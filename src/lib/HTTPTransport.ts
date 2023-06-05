import { API_URL } from 'constants';
import { getType, queryStringify } from 'utils/common';

enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

type RequestOptions = {
  headers?: Record<string, string>;
  method?: Methods;
  withCredentials?: boolean;
};

type HTTPTransportError = {
  reason: string;
  info?: string;
  statusCode: number;
};

type HTTPTransportResponse<T = void> = {
  response: T;
  statusCode: number;
};

export class HTTPTransport {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<R = void>(url: string, data: any = undefined, options: RequestOptions = {}) {
    return this.request<R>(url, data, { ...options, method: Methods.GET });
  }

  post<R = void>(url: string, data: any, options: RequestOptions = {}) {
    return this.request<R>(url, data, { ...options, method: Methods.POST });
  }

  put<R = void>(url: string, data: any, options: RequestOptions = {}) {
    return this.request<R>(url, data, { ...options, method: Methods.PUT });
  }

  patch<R = void>(url: string, data: any, options: RequestOptions = {}) {
    return this.request<R>(url, data, { ...options, method: Methods.PATCH });
  }

  delete<R = void>(url: string, data: any = undefined, options: RequestOptions = {}) {
    return this.request<R>(url, data, { ...options, method: Methods.DELETE });
  }

  request<R = void>(
    url: string,
    data: any = {},
    options: RequestOptions = {},
  ): Promise<HTTPTransportResponse<R> | HTTPTransportError> {
    return new Promise((resolve, reject) => {
      const { headers, method = Methods.GET, withCredentials } = options;

      const xhr = new XMLHttpRequest();
      const query = method === Methods.GET && !!data ? `${queryStringify(data)}` : '';

      const fullUrl = `${this.baseUrl}${url}${query.length > 0 ? `?${query}` : ''}`;

      xhr.open(method, fullUrl);

      xhr.withCredentials = Boolean(withCredentials);

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ response: xhr.response as unknown as R, statusCode: xhr.status });
        } else if (getType(xhr.response) === 'string' && xhr.response.length > 0) {
          const jsonResponse = JSON.parse(xhr.response);
          reject({ reason: 'server_reason', info: jsonResponse.reason, statusCode: xhr.status });
        } else {
          reject({ reason: 'server_reason', info: xhr.statusText, statusCode: xhr.status });
        }
      };

      xhr.onabort = () => reject({ reason: 'abort', info: xhr.statusText });
      xhr.ontimeout = () => reject({ reason: 'timeout', info: xhr.statusText });
      xhr.onerror = () => reject({ reason: 'network_error', info: xhr.statusText });

      if (!(data instanceof FormData)) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      if (method === Methods.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  }
}

export const httpTransport = new HTTPTransport(API_URL);
