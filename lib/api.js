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

// Helper function with smart fallback (only fallback to localhost in development)
export const apiRequestWithFallback = async (endpoint, options = {}) => {
  const primaryUrl = API_URL;
  
  // Only use localhost fallback if we're in development
  const canUseLocalFallback = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const fallbackUrl = canUseLocalFallback && primaryUrl === API_URLS.deployed ? API_URLS.local : null;
  
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
    console.warn(`Primary API failed (${primaryUrl}):`, primaryError.message);
    
    // Only try fallback if we're in development and have a valid fallback URL
    if (fallbackUrl) {
      console.warn(`Trying fallback (${fallbackUrl})...`);
      try {
        const response = await fetch(`${fallbackUrl}${endpoint}`, mergedOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (fallbackError) {
        console.error(`Fallback API also failed:`, fallbackError.message);
        throw new Error(`API request failed for ${endpoint}. Server is unavailable.`);
      }
    } else {
      // No fallback available (production environment)
      console.error(`API request failed for ${endpoint}:`, primaryError.message);
      throw primaryError;
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
