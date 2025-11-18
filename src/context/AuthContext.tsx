import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, CollectionType } from "../utils/type";
import { onAuthStateChanged, type User } from "firebase/auth";
import { clearSessionStorage } from "../utils/utils";
import { auth } from "../firebase";
import { getUserCollections } from "../networks/user";

const initialState: AuthContextType = {
  user: null,
  collections: [],
  handleGetUserCollections: () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const handleGetUserCollections = async () => {
    if (user) {
      try {
        const userCollections = await getUserCollections(user.uid);
        setCollections(userCollections);
      } catch (error) {
        console.error("Failed to fetch user collections:", error);
        setCollections([]);
      }
    }
  };

  useEffect(() => {
    handleGetUserCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        clearSessionStorage();
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, collections, handleGetUserCollections }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
