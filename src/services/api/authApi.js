/**
 * OSKAR Main - Authentication API Service Boundary
 * Provides HTTP client interface for authentication, registration, session validation, and logout.
 */

import apiClient from './apiClient';

export const authApi = {
  /**
   * Submit credentials for user authentication
   */
  async login(email, password) {
    return apiClient.post('/auth/login', { email, password });
  },

  /**
   * Register new researcher / user account
   */
  async register(userData) {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Fetch currently authenticated user session details
   */
  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },

  /**
   * Terminate active user session
   */
  async logout() {
    return apiClient.post('/auth/logout', {});
  },

  /**
   * Refresh authorization tokens
   */
  async refreshToken() {
    return apiClient.post('/auth/refresh', {});
  }
};

export default authApi;
