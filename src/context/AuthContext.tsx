import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType } from "../utils/type";
import { onAuthStateChanged, type User } from "firebase/auth";
import { clearSessionStorage } from "../utils/utils";
import auth from "../services/auth";

const initialState: AuthContextType = {
  user: null,
};

const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        clearSessionStorage();
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
