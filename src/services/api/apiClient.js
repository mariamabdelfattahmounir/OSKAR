/**
 * OSKAR Main - Reusable HTTP API Client Abstraction Layer
 * Handles REST requests, JSON serialization, bearer token injection, and mock fallback.
 */

import env from '../../config/env';

export class ApiClient {
  constructor(baseUrl = env.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Helper to retrieve authorization headers from active user session
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    try {
      const sessionRaw = localStorage.getItem('oskar_session');
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        if (session.token) {
          headers['Authorization'] = `Bearer ${session.token}`;
        } else if (session.id) {
          headers['X-User-ID'] = session.id;
        }
      }
    } catch (e) {
      // Ignore storage read errors
    }

    return headers;
  }

  /**
   * Main request handler wrapping native fetch with error normalization
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = this.getHeaders(options.headers);

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (env.isDev) {
        console.warn(`[ApiClient] Request to ${url} failed:`, err.message);
      }
      throw err;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: 'POST', body, headers });
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: 'PUT', body, headers });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
