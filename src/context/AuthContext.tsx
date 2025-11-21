import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, CollectionType, ImageType } from "../utils/type";
import { onAuthStateChanged, type User } from "firebase/auth";
import { clearSessionStorage } from "../utils/utils";
import { auth } from "../firebase";
import { getUserCollections, getUserLikedImages } from "../networks/user";

const initialState: AuthContextType = {
  user: null,
  collections: [],
  likedImages: [],
  handleGetUserCollections: () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [likedImages, setLikedImages] = useState<ImageType[]>([]);

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

  const handleGetUserLikedImages = async () => {
    if (user) {
      try {
        const likedImages = await getUserLikedImages(user.uid);
        setLikedImages(likedImages);
      } catch (error) {
        console.error("Failed to fetch user liked images:", error);
        setLikedImages([]);
      }
    }
  };

  useEffect(() => {
    handleGetUserCollections();
    handleGetUserLikedImages();
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
      value={{ user, collections, handleGetUserCollections, likedImages }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
