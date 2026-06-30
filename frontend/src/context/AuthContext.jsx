import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

const API_BASE = "https://login-signup-page-133w.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [serverError, setServerError] = useState(false);

  // Verify token with backend
  const verifyToken = async (authToken, userEmail) => {
    setIsVerifying(true);
    setServerError(false);
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { msg: text };
      }

      if (res.ok && (data.msg === "Welcome to Dashboard" || res.status === 200)) {
        setToken(authToken);
        setUser({ email: userEmail });
        setIsAuthenticated(true);
      } else {
        // Invalid token
        logout();
      }
    } catch (err) {
      console.error("Token verification failed", err);
      setServerError(true);
      // Keep token state but mark as unverified/error if server is unreachable
      setToken(authToken);
      setUser({ email: userEmail });
      setIsAuthenticated(true); // Treat as logged in, but dashboard will show unreachable
    } finally {
      setIsVerifying(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("vaultline_token");
    const storedEmail = localStorage.getItem("vaultline_email");

    if (storedToken && storedEmail) {
      verifyToken(storedToken, storedEmail);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { msg: text };
      }

      if (!res.ok) {
        throw new Error(data.msg || "Unable to sign in. Please check your details.");
      }

      if (data.token) {
        localStorage.setItem("vaultline_token", data.token);
        localStorage.setItem("vaultline_email", email);
        setToken(data.token);
        setUser({ email });
        setIsAuthenticated(true);
        setServerError(false);
        return data;
      } else {
        throw new Error(data.msg || "Server returned empty response.");
      }
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        throw new Error("Could not reach the server. Is the backend running on port 8888?");
      }
      throw err;
    }
  };

  const register = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { msg: text };
      }

      if (!res.ok) {
        throw new Error(data.msg || "Unable to create your account.");
      }

      if (data.token) {
        localStorage.setItem("vaultline_token", data.token);
        localStorage.setItem("vaultline_email", email);
        setToken(data.token);
        setUser({ email });
        setIsAuthenticated(true);
        setServerError(false);
        return data;
      } else {
        throw new Error(data.msg || "Server returned empty response.");
      }
    } catch (err) {
      if (err.message.includes("Failed to fetch")) {
        throw new Error("Could not reach the server. Is the backend running on port 8888?");
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("vaultline_token");
    localStorage.removeItem("vaultline_email");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setServerError(false);
  };

  const checkVerification = async () => {
    if (token && user) {
      await verifyToken(token, user.email);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      isVerifying,
      serverError,
      login,
      register,
      logout,
      checkVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
