import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType } from "../utils/type";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../utils/firebase";

const initialState: AuthContextType = {
  user: null,
};

const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
