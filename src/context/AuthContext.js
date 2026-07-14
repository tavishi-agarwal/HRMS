"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ROLES } from "@/constants/roles";
import { getToken } from "@/lib/tokenManager";
import authService from "@/services/auth.service";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        let userData = null;
        try {
          userData = await authService.getMe();
        } catch (meError) {
          console.warn("authService.getMe() failed, falling back to decoding token", meError);
        }

        // If backend /me fails or doesn't return data, decode the JWT token payload
        if (!userData && token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            userData = {
              id: decoded.id || decoded.userId,
              name: decoded.name || "User",
              email: decoded.sub || decoded.email || "",
              role: decoded.role || ROLES.HR, // Temporarily default to HR if no role in token so you can see the tabs
            };
          } catch (e) {
            console.error("Failed to decode token", e);
          }
        }

        if (userData) {
          // Add default role if missing
          if (!userData.role) {
             // Let's set it to HR or ADMIN for now based on email
             userData.role = userData.email?.includes('admin') ? ROLES.ADMIN : ROLES.HR; 
          } else {
             // Ensure it's uppercase to match our ROLES constants
             userData.role = String(userData.role).toUpperCase();
          }
          
          // Verify it's a valid role, fallback to EMPLOYEE if not recognized
          if (!Object.values(ROLES).includes(userData.role)) {
             console.warn(`Unrecognized role: ${userData.role}, defaulting to EMPLOYEE`);
             userData.role = ROLES.EMPLOYEE;
          }
          
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Also listen for auth_changed events (e.g. login/logout)
    const handleAuthChange = () => fetchUser();
    window.addEventListener('auth_changed', handleAuthChange);
    
    fetchUser();
    
    return () => window.removeEventListener('auth_changed', handleAuthChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — shortcut hook (also available from @/hooks/useAuth)
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}