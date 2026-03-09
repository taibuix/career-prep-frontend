"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser, updateCurrentUser } from "./api";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    updateProfile: (data: Pick<User, "name" | "email">) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    const updateProfile = async (data: Pick<User, "name" | "email">) => {
        const response = await updateCurrentUser(data);
        setUser(response.user);
        return response.user;
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be inside AuthProvider");
    return context;
};
