import { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";
import type { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [role, setRole] = useState<string | null>(null);

  const login = (token: string, role: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
