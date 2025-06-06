import { updateProfile, type User } from "firebase/auth";

export const updateUserProfile = (
  user: User,
  profile: { displayName?: string; photoURL?: string }
): Promise<void> => {
  return updateProfile(user, profile);
};
