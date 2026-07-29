import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  major: string;
  points: number;
  avatar?: string;
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

  // Register new account (1 per email limit)
  const registerUserAccount = useCallback((
    name: string,
    email: string,
    studentId: string,
    major: string,
    passwordHash: string,
    initialPoints = 100
  ): { success: boolean; message?: string; user?: UserProfile } => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = readAccountsMap();

    if (accounts[cleanEmail]) {
      return {
        success: false,
        message: `Hòm thư Gmail ${cleanEmail} đã tồn tại trong hệ thống. Vui lòng sử dụng Đăng Nhập.`
      };
    }

    const newProfile: UserProfile = {
      name,
      email: cleanEmail,
      studentId: studentId || "CMC-251156",
      major: major || "Công nghệ Thông tin",
      points: initialPoints
    };

    accounts[cleanEmail] = {
      profile: newProfile,
      passwordHash: passwordHash || "123456"
    };

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    setUser(newProfile);
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));

    return {
      success: true,
      user: newProfile
    };
  }, []);

  const login = useCallback((
    name: string, 
    email: string, 
    studentId: string, 
    major = "Sinh viên CMC", 
    points = 100
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = readAccountsMap();

    let profile: UserProfile;
    if (accounts[cleanEmail]) {
      profile = accounts[cleanEmail].profile;
    } else {
      profile = { name, email: cleanEmail, studentId, major, points };
      accounts[cleanEmail] = { profile, passwordHash: "123456" };
    }

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

  // Change Password for logged-in user
  const changePassword = useCallback((
    email: string,
    currentPass: string,
    newPass: string
  ): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = readAccountsMap();

    if (!accounts[cleanEmail]) {
      accounts[cleanEmail] = {
        profile: {
          name: "Thành Viên EcoValues",
          email: cleanEmail,
          studentId: "BIT250098",
          major: "Công nghệ Thông tin",
          points: 100
        },
        passwordHash: newPass
      };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      return { success: true, message: "Đã cập nhật mật khẩu mới thành công!" };
    }

    const storedHash = accounts[cleanEmail].passwordHash;
    if (storedHash && storedHash !== currentPass) {
      return { success: false, message: "Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại!" };
    }

    accounts[cleanEmail].passwordHash = newPass;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

    return { success: true, message: "Đã cập nhật mật khẩu mới thành công!" };
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
      if (accounts[current.email.toLowerCase()]) {
        accounts[current.email.toLowerCase()].profile.points = newPoints;
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      }

      setUser(updated);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    }
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    const current = readUserFromStorage();
    if (current) {
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      const accounts = readAccountsMap();
      if (accounts[current.email.toLowerCase()]) {
        accounts[current.email.toLowerCase()].profile = updated;
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
    updateUserProfile,
    isEmailRegistered,
    registerUserAccount,
    resetUserPassword,
    changePassword
  };
}
