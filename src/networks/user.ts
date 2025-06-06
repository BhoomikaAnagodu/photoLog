import { updateProfile, type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import db from "../services/db";

import type { ImageType } from "../utils/type";

export const updateUserProfile = async (
  user: User,
  profile: { displayName?: string; photoURL?: string }
): Promise<void> => {
  try {
    await updateProfile(user, profile);
  } catch (error) {
    console.error("Error updating the profile:", error);
    throw error;
  }
};

export const likeImage = async (
  userId: string,
  imageId: string,
  imageData: Omit<ImageType, "id">
): Promise<void> => {
  try {
    const likeDocRef = doc(db, "users", userId, "likes", imageId);
    await setDoc(likeDocRef, imageData);
  } catch (error) {
    console.error("Error liking image:", error);
    throw error;
  }
};

export const addImageToCollection = async (
  userId: string,
  collectionId: string,
  imageId: string,
  imageData: Omit<ImageType, "id">
): Promise<void> => {
  try {
    const imageDocRef = doc(
      db,
      "users",
      userId,
      "collections",
      collectionId,
      "images",
      imageId
    );
    await setDoc(imageDocRef, imageData);
  } catch (error) {
    console.error("Error adding image to collection:", error);
    throw error;
  }
};

export const isImageLiked = async (
  userId: string,
  imageId: string
): Promise<boolean> => {
  try {
    const likeDocRef = doc(db, "users", userId, "likes", imageId);
    const snapshot = await getDoc(likeDocRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error fetching image details:", error);
    throw error;
  }
};
