import type { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
}

export type AuthAction = () => void | Promise<void>;
