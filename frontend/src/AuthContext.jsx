
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, clearStoredAuth } from "./api.js";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [authLoading, setAuthLoading] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setAuthLoading(false);
  }, []);

  // Validate the saved session whenever the app starts.
  useEffect(() => {
    let active = true;

    function handleExpiredSession() {
      if (active) {
        setUser(null);
        setAuthLoading(false);
      }
    }

    window.addEventListener("auth:expired", handleExpiredSession);

    async function validateSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        clearStoredAuth();
        if (active) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      try {
        const data = await api("/auth/me");

        if (!active) return;

        if (!data.user) {
          logout();
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } catch {
        if (active) {
          logout();
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    validateSession();

    return () => {
      active = false;
      window.removeEventListener("auth:expired", handleExpiredSession);
    };
  }, [logout]);

  async function login(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (!data.token || !data.user) {
      throw new Error("The server did not return a valid login session.");
    }

    // Store the new token and user only after login succeeds.
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setAuthLoading(false);
  }

  const value = {
    user,
    login,
    logout,
    authLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
