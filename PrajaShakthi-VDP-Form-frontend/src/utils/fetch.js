const TOKEN_KEY = "token";

/**
 * Authenticated fetch wrapper that automatically adds JWT token
 */
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    console.error('❌ 401 Unauthorized - Clearing token');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user');
    // Don't redirect here, let the app handle it
  }

  return response;
};

export default authFetch;
