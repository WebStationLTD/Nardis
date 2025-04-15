/**
 * Client-side authentication utilities
 */

// Function to refresh the JWT token
export async function refreshToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to refresh token');
    }

    const data = await response.json();
    return data.jwt;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Wrapper for authenticated fetch requests
export async function authFetch(url, options = {}) {
  // First attempt with current token
  let response = await fetch(url, options);
  
  // If we get a 401 Unauthorized, try to refresh the token
  if (response.status === 401) {
    const newToken = await refreshToken();
    
    // If token refresh was successful, retry the original request
    if (newToken) {
      // Retry the original request
      response = await fetch(url, options);
    }
  }
  
  return response;
}