/**
 * OSKAR Main - Centralized Environment & Feature Configuration Loader
 * Safely reads Vite environment variables with sensible development defaults.
 */

export const env = {
  // Base API URL for backend HTTP REST services
  apiBaseUrl: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Toggle mock service fallback (default: true for frontend SPA decoupling)
  useMockServices: import.meta.env?.VITE_USE_MOCK_SERVICES === 'true' || import.meta.env?.VITE_USE_MOCK_SERVICES === undefined,

  // Selected AI provider integration ('mock' | 'gemini' | 'openai')
  aiProvider: import.meta.env?.VITE_AI_PROVIDER || 'mock',

  // Application environment flags
  isDev: import.meta.env?.DEV ?? true,
  isProd: import.meta.env?.PROD ?? false,
  mode: import.meta.env?.MODE || 'development',
};

export default env;
