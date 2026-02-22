'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { config } from '@/lib/config';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => false,
    logout: () => { },
    isLoading: true,
});

export function useAuth() {
    return useContext(AuthContext);
}

const AUTH_KEY = 'candi_ops_26_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = sessionStorage.getItem(AUTH_KEY);
        const isAuth = stored === 'authenticated';
        // Batch both state updates together
        if (isAuth) setIsAuthenticated(true);
        setIsLoading(false);
    }, []);

    const login = useCallback((password: string): boolean => {
        if (password === config.password) {
            sessionStorage.setItem(AUTH_KEY, 'authenticated');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
