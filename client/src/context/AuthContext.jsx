import { createContext, useContext, useMemo, useState } from "react";
import api from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alzikrayat_user")); } catch { return null; }
  });
  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("alzikrayat_token", data.token);
    localStorage.setItem("alzikrayat_user", JSON.stringify(data.user));
    setUser(data.user);
  }
  async function register(form) {
    const { data } = await api.post("/auth/register", form);
    localStorage.setItem("alzikrayat_token", data.token);
    localStorage.setItem("alzikrayat_user", JSON.stringify(data.user));
    setUser(data.user);
  }
  function logout() {
    localStorage.removeItem("alzikrayat_token");
    localStorage.removeItem("alzikrayat_user");
    setUser(null);
  }
  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
