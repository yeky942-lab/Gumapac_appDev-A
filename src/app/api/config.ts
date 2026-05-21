// CREAM API Configuration
// Do not change the base URL - using local dev server
export const API_BASE_URL = __DEV__
  ? 'https://finalprojectwebdev-staging.up.railway.app/api'
  : 'https://finalprojectwebdev-staging.up.railway.app/api';

// API Response Timeout (30 seconds)
export const API_TIMEOUT = 30000;

// JWT Token Configuration
export const JWT_TTL = 3600; // 1 hour in seconds
