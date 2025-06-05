import type { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
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
