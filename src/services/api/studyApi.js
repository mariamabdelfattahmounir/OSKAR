/**
 * OSKAR Main - Clinical Study Lifecycle API Service Boundary
 * Provides API client interfaces for study creation, updates, drafts, and workspace execution.
 */

import apiClient from './apiClient';

export const studyApi = {
  /**
   * Fetch paginated list of studies owned by or accessible to current user
   */
  async listStudies(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/studies${query ? `?${query}` : ''}`);
  },

  /**
   * Fetch single study protocol by ID
   */
  async getStudy(id) {
    return apiClient.get(`/studies/${id}`);
  },

  /**
   * Create new clinical study protocol
   */
  async createStudy(studyData) {
    return apiClient.post('/studies', studyData);
  },

  /**
   * Update existing study protocol configuration
   */
  async updateStudy(id, studyData) {
    return apiClient.put(`/studies/${id}`, studyData);
  },

  /**
   * Delete or archive study protocol
   */
  async deleteStudy(id) {
    return apiClient.delete(`/studies/${id}`);
  },

  /**
   * Save workflow draft state
   */
  async saveDraft(type, draftData) {
    return apiClient.post('/studies/drafts', { type, data: draftData });
  },

  /**
   * Fetch active draft for specific study methodology type
   */
  async getDraft(type) {
    return apiClient.get(`/studies/drafts/${type}`);
  },

  /**
   * Submit study protocol for supervisor review
   */
  async submitForSupervisorReview(id, comments = '') {
    return apiClient.post(`/studies/${id}/supervisor-review`, { comments });
  }
};

export default studyApi;
