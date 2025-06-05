import { signOut } from "firebase/auth";
import auth from "../services/auth";
import type { SnackBarType } from "./type";

export const clearSessionStorage = () => {
  sessionStorage.clear();
};

export const handleAuthErrors = (code: string): string => {
  switch (code) {
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error! Please check your internet connection and try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

export const logout = async (): Promise<SnackBarType> => {
  try {
    await signOut(auth);
    clearSessionStorage(); // Clear any stored session data
    return { type: "success", message: "Succefully Logout" };
  } catch {
    return {
      type: "error",
      message: "Error signing out. Please try again later",
    };
  }
};
