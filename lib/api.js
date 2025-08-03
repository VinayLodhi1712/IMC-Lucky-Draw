// API configuration utility with automatic fallback
const API_URLS = {
  local: 'http://localhost:5000',
  deployed: 'https://imc-lucky-draw.onrender.com'
};

const getApiUrl = () => {
  // Priority: Environment variable > Local development > Deployed
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In development, prefer local, in production prefer deployed
  if (process.env.NODE_ENV === 'development') {
    return API_URLS.local;
  }
  
  return API_URLS.deployed;
};

// Export the primary API URL
export const API_URL = getApiUrl();

// Helper function with automatic fallback between local and deployed
export const apiRequestWithFallback = async (endpoint, options = {}) => {
  const primaryUrl = API_URL;
  const fallbackUrl = primaryUrl === API_URLS.local ? API_URLS.deployed : API_URLS.local;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  // Try primary URL first
  try {
    const response = await fetch(`${primaryUrl}${endpoint}`, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (primaryError) {
    console.warn(`Primary API failed (${primaryUrl}), trying fallback (${fallbackUrl})...`);
    
    // Try fallback URL
    try {
      const response = await fetch(`${fallbackUrl}${endpoint}`, mergedOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (fallbackError) {
      console.error(`Both API endpoints failed:`, {
        primary: primaryError.message,
        fallback: fallbackError.message
      });
      throw new Error(`API request failed for ${endpoint}. Both local and deployed servers are unavailable.`);
    }
  }
};

// Simple API request (no fallback)
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

const apiUtils = { API_URL, apiRequest, apiRequestWithFallback, API_URLS };
export default apiUtils;
