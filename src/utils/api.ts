import { HTTPTransportError, HTTPTransportResponse } from 'lib/http-transport';

export const isGoodApiResponse = <T>(
  response: HTTPTransportResponse<T> | HTTPTransportError,
): response is HTTPTransportResponse<T> => {
  return response.statusCode >= 200 && response.statusCode < 300;
};

export const isBadResponse = <T>(
  response: HTTPTransportResponse<T> | HTTPTransportError,
): response is HTTPTransportError => {
  return response.statusCode < 200 || response.statusCode >= 300;
};
