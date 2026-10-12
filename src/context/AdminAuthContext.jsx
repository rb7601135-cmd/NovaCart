import React, { createContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

const ADMIN_CREDENTIALS_KEY = 'novacart_admin_credentials';
const ADMIN_SESSION_KEY = 'novacart_admin_session';
const ADMIN_ATTEMPTS_KEY = 'novacart_admin_failed_attempts';

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  name: 'Store Administrator',
  email: 'admin@novacart.store',
  role: 'Super Admin'
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout

export const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  // 1. Credentials (customizable by admin in Settings)
  const [credentials, setCredentials] = useState(() =>
    getStorageItem(ADMIN_CREDENTIALS_KEY, DEFAULT_ADMIN)
  );

  // 2. Active Session
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!session) return null;
      const parsed = JSON.parse(session);
      // Verify session hasn't expired (e.g. 24 hours)
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // 3. Rate limiting / Security lockout
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const record = getStorageItem(ADMIN_ATTEMPTS_KEY, { count: 0, lockoutUntil: 0 });
    return record;
  });

  // Sync credentials to storage
  useEffect(() => {
    setStorageItem(ADMIN_CREDENTIALS_KEY, credentials);
  }, [credentials]);

  // Sync failed attempts
  useEffect(() => {
    setStorageItem(ADMIN_ATTEMPTS_KEY, failedAttempts);
  }, [failedAttempts]);

  // Login handler
  const login = (usernameInput, passwordInput) => {
    const now = Date.now();

    // Check if currently locked out
    if (failedAttempts.lockoutUntil && now < failedAttempts.lockoutUntil) {
      const remainingSecs = Math.ceil((failedAttempts.lockoutUntil - now) / 1000);
      return {
        success: false,
        error: `Security Lockout: Too many failed attempts. Please wait ${remainingSecs} seconds before trying again.`,
        locked: true,
        remainingSecs
      };
    }

    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    const expectedUser = credentials.username.toLowerCase();
    const expectedPass = credentials.password;

    if (cleanUser === expectedUser && cleanPass === expectedPass) {
      // Success: Reset failed attempts
      setFailedAttempts({ count: 0, lockoutUntil: 0 });

      const newSession = {
        token: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        username: credentials.username,
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        timestamp: now
      };

      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(newSession));
      } catch (e) {
        console.warn('SessionStorage write error:', e);
      }

      setAdminSession(newSession);
      return { success: true };
    } else {
      // Failure: Increment failed attempts
      const newCount = (failedAttempts.count || 0) + 1;
      let lockoutUntil = 0;

      if (newCount >= MAX_FAILED_ATTEMPTS) {
        lockoutUntil = now + LOCKOUT_DURATION_MS;
      }

      const updatedAttempts = { count: newCount, lockoutUntil };
      setFailedAttempts(updatedAttempts);

      if (lockoutUntil > 0) {
        return {
          success: false,
          error: `Account locked for 60 seconds due to ${MAX_FAILED_ATTEMPTS} consecutive failed attempts.`,
          locked: true,
          remainingSecs: 60
        };
      }

      const remainingTries = MAX_FAILED_ATTEMPTS - newCount;
      return {
        success: false,
        error: `Invalid username or password. (${remainingTries} attempt${remainingTries === 1 ? '' : 's'} remaining)`,
        locked: false,
        remainingTries
      };
    }
  };

  // Logout handler
  const logout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.warn('SessionStorage remove error:', e);
    }
    setAdminSession(null);
  };

  // Update credentials (called from Settings)
  const updateCredentials = (newUsername, newPassword) => {
    setCredentials((prev) => ({
      ...prev,
      username: newUsername.trim(),
      password: newPassword.trim()
    }));
  };

  const isAdminAuthenticated = Boolean(adminSession?.token);

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser: adminSession,
        currentCredentials: credentials,
        failedAttempts,
        login,
        logout,
        updateCredentials
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
