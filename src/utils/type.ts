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
