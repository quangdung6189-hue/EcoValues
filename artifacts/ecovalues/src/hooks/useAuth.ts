import { useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  major: string;
  points: number;
}

const STORAGE_KEY = "ecovalues_user_profile";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (name: string, email: string, studentId: string, major: string = "Công nghệ Thông tin", initialPoints: number = 2450) => {
    const profile: UserProfile = {
      name,
      email,
      studentId,
      major,
      points: initialPoints
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updatePoints = (newPoints: number) => {
    if (user) {
      const updated = { ...user, points: newPoints };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    }
  };

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    updatePoints
  };
}
