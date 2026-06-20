"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User } from "@/types";
import * as api from "@/lib/api";
import { mapUser, toApiUpdateUser } from "@/lib/mappers";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const saved = localStorage.getItem("auth_user");

    let parsedUser: User | null = null;

    if (token && saved) {
      try {
        parsedUser = JSON.parse(saved) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
    setHydrated(true);

    // Verify token is still valid (best-effort — if it fails, clear session)
    if (token && parsedUser) {
      api
        .getMe()
        .then((apiUser) => {
          const mapped = mapUser(apiUser);
          setUser(mapped);
          setIsAuthenticated(true);
          localStorage.setItem("auth_user", JSON.stringify(mapped));
        })
        .catch(() => {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("auth_user");
        });
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const { user: apiUser } = await api.login(email, password);
        const mapped = mapUser(apiUser);
        setUser(mapped);
        setIsAuthenticated(true);
        localStorage.setItem("auth_user", JSON.stringify(mapped));
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    // Best-effort server-side logout — don't block on failure.
    // api.logout() clears the auth_token internally.
    api.logout().catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_user");
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      const payload = toApiUpdateUser(data);
      const updated = await api.updateUser(user.id, payload);
      const mapped = mapUser(updated);
      setUser(mapped);
      setIsAuthenticated(true);
      localStorage.setItem("auth_user", JSON.stringify(mapped));
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, hydrated, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
