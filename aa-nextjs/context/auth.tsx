"use client";

import { auth } from "@/firebase/client";
import {
  GoogleAuthProvider,
  ParsedToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { removeToken, setToken } from "./action";

type AuthContextType = {
  currentUser: User | null;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  customClaims: ParsedToken | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user ?? null);
      if (user) {
        // Set custom claims for admin users via API
        if (user.email) {
          try {
            const response = await fetch("/api/set-admin-claims", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: user.email }),
            });

            if (!response.ok) {
              console.error("Failed to set admin claims");
            }
          } catch (error) {
            console.error("Error setting custom claims:", error);
          }
        }

        const tokenResult = await user.getIdTokenResult(true); // Force refresh to get updated claims
        const token = tokenResult.token;
        const refreshToken = user.refreshToken;
        const claims = tokenResult.claims;
        setCustomClaims(claims ?? null);
        if (token && refreshToken) {
          await setToken({ token, refreshToken });
        }
      } else {
        await removeToken();
      }
    });

    // cleanup function (should not trigger as we work with Firebase Auth, but good practice)
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logout,
        loginWithGoogle,
        loginWithEmail,
        customClaims,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
