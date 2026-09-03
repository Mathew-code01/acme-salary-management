// client/src/lib/api-client.ts

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { logger } from './logger';

const API_BASE_URL = (import.meta.env.VITE_API_URL?.trim() || '/api/v1').replace(/\/+$/, '');

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,

  timeout: 15_000,

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },

  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.debug('API request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });

    return config;
  },

  (error: unknown) => {
    logger.error('Failed to prepare API request', error);

    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API response', {
      method: response.config.method?.toUpperCase(),

      url: response.config.url,

      status: response.status,
    });

    return response;
  },

  (error: unknown) => {
    /*
     * Request cancellation is expected during:
     *
     * - React StrictMode
     * - component unmounts
     * - React Query refetching
     * - AbortController cancellation
     *
     * It is not a server failure.
     */
    if (axios.isCancel(error)) {
      logger.debug('API request cancelled');

      return Promise.reject(error);
    }

    if (axios.isAxiosError(error)) {
      logger.error('API request failed', error, {
        method: error.config?.method?.toUpperCase(),

        url: error.config?.url,

        status: error.response?.status,

        response: error.response?.data,
      });

      return Promise.reject(error);
    }

    logger.error('API request failed', error);

    return Promise.reject(error);
  },
);