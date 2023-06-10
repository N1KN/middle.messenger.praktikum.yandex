import { APP_URLS } from 'constants';
import { getType, queryStringify } from 'utils/common';
import { showTooltip } from '../utils/tooltip';

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
  withoutCredentials?: boolean;
};

export type HTTPTransportError = {
  reason: string;
  info?: string;
  statusCode: number;
};

export type HTTPTransportResponse<T = void> = {
  data: T;
  statusCode: number;
};

export class HTTPTransport {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<R = void>(url: string, data: any = undefined, options: RequestOptions = {}) {
    try {
      const query = queryStringify(data ?? {});
      const fullUrl = `${url}${query.length > 0 ? `?${query}` : ''}`;
      return this.request<R>(fullUrl, data, { ...options, method: Methods.GET });
    } catch (err) {
      showTooltip({
        message: `Ошибка при отправке GET запроса: ${(err as Error).message}`,
        type: 'error',
      });

      return { reason: 'catch_error', info: (err as Error).message } as HTTPTransportError;
    }
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
      const { headers, method = Methods.GET, withoutCredentials } = options;

      const xhr = new XMLHttpRequest();

      xhr.open(method, `${this.baseUrl}${url}`, true);

      xhr.withCredentials = !withoutCredentials;

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          const contentType = xhr.getResponseHeader('Content-Type')?.toLowerCase();
          if (contentType && contentType.indexOf('application/json') !== -1) {
            resolve({ data: JSON.parse(xhr.response) as unknown as R, statusCode: xhr.status });
          } else {
            resolve({ data: xhr.response as unknown as R, statusCode: xhr.status });
          }
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

      let fixedData = data;
      if (!(data instanceof FormData)) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        fixedData = JSON.stringify(data);
      }

      try {
        if (method === Methods.GET || !data) {
          xhr.send();
        } else {
          xhr.send(fixedData);
        }
      } catch (e) {
        console.error(e);
        reject({ reason: 'catch_error', info: (e as Error).message });
      }
    });
  }
}

export const httpTransport = new HTTPTransport(APP_URLS.API);
