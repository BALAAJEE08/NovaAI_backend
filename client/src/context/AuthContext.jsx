import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, getErrorMessage } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("nova_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("nova_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem("nova_token", nextToken);
    localStorage.setItem("nova_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      persist(data);
      toast.success("Welcome back");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      persist(data);
      toast.success("Account created");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (nextUser) => {
    localStorage.setItem("nova_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("nova_token");
    localStorage.removeItem("nova_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, loading, isAuthenticated: Boolean(token && user), login, register, logout, updateUser }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
