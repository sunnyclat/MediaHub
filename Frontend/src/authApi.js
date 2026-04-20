import { api } from "./api";

// Hook-like utility to create authenticated API calls
// Usage: const authApi = createAuthApi(token); authApi('/endpoint', options)
export function createAuthApi(token) {
  return (path, options = {}) => {
    return api(path, { ...options, token });
  };
}
