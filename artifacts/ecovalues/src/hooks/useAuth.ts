import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  major: string;
  points: number;
}

interface StoredAccount {
  profile: UserProfile;
  passwordHash: string;
}

const STORAGE_KEY = "ecovalues_user_profile";
const ACCOUNTS_KEY = "ecovalues_registered_accounts";
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

  const readAccountsMap = (): Record<string, StoredAccount> => {
    try {
      const saved = localStorage.getItem(ACCOUNTS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
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

  // Check if an email is already registered in localStorage database
  const isEmailRegistered = useCallback((email: string): boolean => {
    const accounts = readAccountsMap();
    const cleanEmail = email.trim().toLowerCase();
    return !!accounts[cleanEmail];
  }, []);

  // Register new account (Fails if email already exists!)
  const registerUserAccount = useCallback((
    name: string, 
    email: string, 
    studentId: string, 
    major: string = "Công nghệ Thông tin",
    password: string = "",
    initialPoints: number = 100 // Bronze tier starting points!
  ): { success: boolean; user?: UserProfile; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = readAccountsMap();

    if (accounts[cleanEmail]) {
      return {
        success: false,
        message: `Email ${cleanEmail} đã được đăng ký tài khoản trước đó! Vui lòng đăng nhập hoặc chọn Quên Mật Khẩu.`
      };
    }

    const newProfile: UserProfile = {
      name,
      email: cleanEmail,
      studentId,
      major,
      points: initialPoints // Start at Bronze Rank (100 pt)
    };

    accounts[cleanEmail] = {
      profile: newProfile,
      passwordHash: password
    };

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    setUser(newProfile);
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));

    return { success: true, user: newProfile };
  }, []);

  // Login existing account
  const login = useCallback((name: string, email: string, studentId: string, major: string = "Công nghệ Thông tin", points?: number) => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = readAccountsMap();
    let userPoints = points;

    if (accounts[cleanEmail]) {
      const stored = accounts[cleanEmail].profile;
      userPoints = points !== undefined ? points : stored.points;
    } else if (userPoints === undefined) {
      userPoints = 100; // Default Bronze tier initial points
    }

    const profile: UserProfile = {
      name,
      email: cleanEmail,
      studentId,
      major,
      points: userPoints
    };

    // Save/Update account record
    accounts[cleanEmail] = {
      profile,
      passwordHash: accounts[cleanEmail]?.passwordHash || ""
    };

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    return profile;
  }, []);

  // Reset Password for registered account
  const resetUserPassword = useCallback((email: string, newPassword: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = readAccountsMap();

    if (!accounts[cleanEmail]) {
      // If email doesn't exist yet, we still allow resetting to create credentials
      accounts[cleanEmail] = {
        profile: {
          name: "Thành Viên EcoValues",
          email: cleanEmail,
          studentId: "CMC-251156",
          major: "Công nghệ Thông tin",
          points: 100
        },
        passwordHash: newPassword
      };
    } else {
      accounts[cleanEmail].passwordHash = newPassword;
    }

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return {
      success: true,
      message: `Đã đặt lại mật khẩu mới cho hòm thư ${cleanEmail} thành công!`
    };
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
      
      const accounts = readAccountsMap();
      if (accounts[current.email]) {
        accounts[current.email].profile.points = newPoints;
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      }

      setUser(updated);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    }
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    updatePoints,
    isEmailRegistered,
    registerUserAccount,
    resetUserPassword
  };
}
