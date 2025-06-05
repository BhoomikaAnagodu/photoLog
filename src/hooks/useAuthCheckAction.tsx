import { useState, useCallback } from "react";
import AuthForm from "../containers/AuthForm";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import type { AuthAction } from "../utils/type";

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
          await action();
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

  const handleLoginClose = async () => {
    setShowLogin(false);
    if (user && pendingAction) {
      setLoading(true);
      try {
        await pendingAction();
      } finally {
        setPendingAction(null);
        setLoading(false);
      }
    }
  };

  const Login = showLogin ? (
    <Modal onClose={handleLoginClose}>
      <AuthForm isModal={true} />
    </Modal>
  ) : null;

  return { runWithAuth, Login, loading };
};
