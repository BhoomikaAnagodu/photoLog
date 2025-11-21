import type { User } from "firebase/auth";
import type { Dispatch, SetStateAction } from "react";

export interface AuthContextType {
  user: User | null;
  collections: CollectionType[];
  likedImages: ImageType[];
  handleGetUserCollections: () => void;
}

export interface SnackBarType {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  autoDismiss?: boolean;
}

interface ValidationRule {
  required?: boolean;
  regex?: RegExp;
  matchField?: keyof AuthFormSchema;
  errMessage: string;
}

export interface InputFieldType {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  validations?: ValidationRule[];
}

export interface AuthFormSchema {
  userName?: InputFieldType;
  email: InputFieldType;
  password: InputFieldType;
  confirmPassword?: InputFieldType;
}

export type AuthAction = (user: User) => void | Promise<void>;

export interface ImageType {
  id: string;
  alt_description: string;
  description?: string | null;
  urls: { small: string; regular: string };
  user: { name: string };
  likedAt?: Date;
  createdAt?: Date;
}

export interface AppContextType {
  list: ImageType[];
  setList: Dispatch<SetStateAction<ImageType[]>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFetching: boolean;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
}

export interface CollectionType {
  id: string;
  images: ImageType[];
}
