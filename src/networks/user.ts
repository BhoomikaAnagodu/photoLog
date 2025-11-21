import { updateProfile, type User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db, storage } from "../firebase";

import type { CollectionType, ImageType } from "../utils/type";
import { base64toBlob } from "../utils/utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
    console.error("Error liking an image:", error);
    throw error;
  }
};

export const disLikeImage = async (userId: string, imageId: string) => {
  try {
    const likeDocRef = doc(db, "users", userId, "likes", imageId);
    await deleteDoc(likeDocRef);
  } catch (error) {
    console.error("Error disliking an image:", error);
    throw error;
  }
};

export const addImageToCollection = async (
  userId: string,
  collectionName: string,
  imageId: string,
  imageData: Omit<ImageType, "id">
): Promise<void> => {
  try {
    const collectionDocRef = doc(
      db,
      "users",
      userId,
      "collections",
      collectionName
    );
    const collectionSnapshot = await getDoc(collectionDocRef);

    // Ensure parent collection doc exists
    if (!collectionSnapshot.exists()) {
      await setDoc(collectionDocRef, {
        createdAt: new Date().toISOString(),
      });
    }

    // Add the image to the subcollection
    const imageDocRef = doc(
      db,
      "users",
      userId,
      "collections",
      collectionName,
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

export const getUserCollections = async (
  userId: string
): Promise<CollectionType[]> => {
  try {
    const collectionsRef = collection(db, "users", userId, "collections");
    const collectionsSnapshot = await getDocs(collectionsRef);

    const collections: CollectionType[] = [];

    for (const collectionDoc of collectionsSnapshot.docs) {
      const collectionName = collectionDoc.id;

      const imagesRef = collection(
        db,
        "users",
        userId,
        "collections",
        collectionName,
        "images"
      );

      const imagesSnapshot = await getDocs(imagesRef);

      const images: ImageType[] = imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ImageType[];

      collections.push({
        id: collectionName,
        images,
      });
    }

    return collections;
  } catch (error) {
    console.error("Error fetching collection details:", error);
    throw error;
  }
};

export const uploadProfilePicture = async (
  user: User,
  imageUrl: string
): Promise<void> => {
  const blob = base64toBlob(imageUrl);
  const storageRef = ref(storage, `profilePictures/${user?.uid}.png`);
  try {
    // Upload image to Storage
    await uploadBytes(storageRef, blob);

    // Get URL
    const photoURL = await getDownloadURL(storageRef);

    // Update Firebase Auth user profile
    await updateProfile(user, { photoURL });
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

export const getUserLikedImages = async (
  userId: string
): Promise<ImageType[]> => {
  try {
    const likesRef = collection(db, "users", userId, "likes");
    const likesSnapshot = await getDocs(likesRef);

    const likedImages = likesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ImageType[];

    return likedImages;
  } catch (error) {
    console.error("Error fetching liked images:", error);
    throw error;
  }
};
