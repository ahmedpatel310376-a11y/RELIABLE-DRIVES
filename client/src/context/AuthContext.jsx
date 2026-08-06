import { createContext, useContext, useEffect, useMemo, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("rd_token"));
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("rd_admin");
    return saved ? JSON.parse(saved) : null;
  });
  const [checkingAuth, setCheckingAuth] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    http.get("/auth/me")
      .then(({ data }) => {
        localStorage.setItem("rd_admin", JSON.stringify(data));
        setAdmin(data);
      })
      .catch(() => {
        localStorage.removeItem("rd_token");
        localStorage.removeItem("rd_admin");
        setToken(null);
        setAdmin(null);
      })
      .finally(() => setCheckingAuth(false));
  }, [token]);

  const login = async (credentials) => {
    const { data } = await http.post("/auth/login", credentials);
    localStorage.setItem("rd_token", data.token);
    localStorage.setItem("rd_admin", JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);
    setCheckingAuth(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("rd_token");
    localStorage.removeItem("rd_admin");
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ admin, checkingAuth, isAuthenticated: Boolean(token), login, logout }),
    [admin, checkingAuth, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
