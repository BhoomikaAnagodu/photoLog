import { useState, useCallback } from "react";
import AuthForm from "../containers/AuthForm";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import type { AuthAction } from "../utils/type";
import type { User } from "firebase/auth";

export const useAuthCheckAction = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [pendingAction, setPendingAction] = useState<AuthAction | null>(null);
  const [loading, setLoading] = useState(false);

  const runWithAuth = useCallback(
    async (action: AuthAction) => {
      if (user) {
        setLoading(true);
        try {
          await action(user);
        } finally {
          setLoading(false);
        }
      } else {
        setPendingAction(() => action);
        setShowLogin(true);
      }
    },
    [user]
  );

  const handleLoginClose = async (user: User | null) => {
    setShowLogin(false);
    if (user && pendingAction) {
      setLoading(true);
      try {
        await pendingAction(user);
      } finally {
        setPendingAction(null);
        setLoading(false);
      }
    }
  };

  const Login = showLogin ? (
    <Modal onClose={() => handleLoginClose(user)}>
      <AuthForm isModal={true} handleLoginClose={handleLoginClose} />
    </Modal>
  ) : null;

  return { runWithAuth, Login, loading, user };
};
