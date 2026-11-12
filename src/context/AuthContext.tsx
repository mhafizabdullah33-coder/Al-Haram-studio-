import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../storage/storageService';
import { Customer } from '../types';
import { useStore } from './StoreContext';

interface AuthContextType {
  currentUser: Customer | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signup: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<Customer>) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useStore();
  const [currentUser, setCurrentUser] = useState<Customer | null>(() => {
    const authData = storageService.getAuth();
    return authData?.user || null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const authData = storageService.getAuth();
    return Boolean(authData?.isAdmin);
  });

  const saveAuthSession = (user: Customer | null, adminRole: boolean) => {
    setCurrentUser(user);
    setIsAdmin(adminRole);
    storageService.saveAuth({
      user,
      token: user ? 'token_' + Date.now() : null,
      isAdmin: adminRole,
    });
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const customers = storageService.getCustomers();
    const found = customers.find((c) => c.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'No account found with this email address.' };
    }

    // Verify password if recorded, or allow default demo password
    if (found.passwordHash && found.passwordHash !== pass) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    saveAuthSession(found, found.role === 'admin');
    showToast('Welcome back!', `Signed in as ${found.fullName}`);
    return { success: true, message: 'Login successful' };
  };

  const adminLogin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    // Default admin demo credentials
    if (cleanEmail === 'admin@alharam.com' && pass === 'admin123') {
      const adminUser: Customer = {
        id: 'admin-master',
        fullName: 'Al-Haram Store Administrator',
        email: 'admin@alharam.com',
        phone: '+92 300 1234567',
        role: 'admin',
        totalSpent: 0,
        ordersCount: 0,
        createdAt: '2026-01-01T00:00:00Z',
      };
      saveAuthSession(adminUser, true);
      showToast('Admin Access Granted', 'Welcome to Al-Haram Management Console');
      return { success: true, message: 'Admin authenticated successfully' };
    }

    return {
      success: false,
      message: 'Invalid administrative credentials. Use demo: admin@alharam.com / admin123',
    };
  };

  const signup = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const customers = storageService.getCustomers();

    if (customers.some((c) => c.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newCustomer: Customer = {
      id: 'cust-' + Date.now(),
      fullName: userData.fullName.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      role: 'customer',
      totalSpent: 0,
      ordersCount: 0,
      passwordHash: userData.password,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [...customers, newCustomer];
    storageService.saveCustomers(updatedList);
    saveAuthSession(newCustomer, false);
    showToast('Account Created!', `Welcome to Al-Haram, ${newCustomer.fullName}!`);
    return { success: true, message: 'Account registered successfully' };
  };

  const logout = () => {
    saveAuthSession(null, false);
    showToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const updateProfile = (updates: Partial<Customer>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    const customers = storageService.getCustomers().map((c) => (c.id === updated.id ? updated : c));
    storageService.saveCustomers(customers);
    saveAuthSession(updated, isAdmin);
    showToast('Profile Updated', 'Your profile details were updated.');
  };

  const changePassword = async (
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Please sign in first.' };
    if (currentUser.passwordHash && currentUser.passwordHash !== oldPass) {
      showToast('Incorrect Password', 'Your current password does not match.', 'error');
      return { success: false, message: 'Current password incorrect.' };
    }
    const updated = { ...currentUser, passwordHash: newPass };
    setCurrentUser(updated);
    const customers = storageService.getCustomers().map((c) => (c.id === updated.id ? updated : c));
    storageService.saveCustomers(customers);
    saveAuthSession(updated, isAdmin);
    showToast('Password Changed', 'Your security password has been updated.');
    return { success: true, message: 'Password updated successfully' };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isAuthenticated: !!currentUser,
        login,
        adminLogin,
        signup,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
