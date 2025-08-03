"use client";
import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Function to load auth from localStorage
  const loadAuthFromStorage = () => {
    try {
      const data = localStorage.getItem("auth");
      if (data) {
        const parsedData = JSON.parse(data);
        setAuth({
          user: parsedData.user || null,
          token: parsedData.token || "",
        });
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage:", error);
      localStorage.removeItem("auth"); // Remove corrupted data
    }
  };

  useEffect(() => {
    loadAuthFromStorage();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "auth") {
        loadAuthFromStorage();
      }
    };

    // Listen for window focus (when user comes back to tab)
    const handleWindowFocus = () => {
      loadAuthFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
