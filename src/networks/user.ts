import { updateProfile, type User } from "firebase/auth";

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
