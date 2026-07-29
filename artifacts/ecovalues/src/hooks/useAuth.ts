import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  major: string;
  points: number;
}

const STORAGE_KEY = "ecovalues_user_profile";
const AUTH_EVENT_NAME = "ecovalues_auth_change";

export function useAuth() {
  const readUserFromStorage = (): UserProfile | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState<UserProfile | null>(readUserFromStorage);

  // Synchronize state across all components and browser tabs instantly
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(readUserFromStorage());
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const login = useCallback((name: string, email: string, studentId: string, major: string = "Công nghệ Thông tin", initialPoints: number = 2450) => {
    const profile: UserProfile = {
      name,
      email,
      studentId,
      major,
      points: initialPoints
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    return profile;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  }, []);

  const updatePoints = useCallback((newPoints: number) => {
    const current = readUserFromStorage();
    if (current) {
      const updated = { ...current, points: newPoints };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    }
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    updatePoints
  };
}
