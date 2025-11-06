import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackBarContext";
import { logoutUser } from "../networks/auth";
import { useLoader } from "../context/LoaderContext";
import { clearSessionStorage } from "../utils/utils";

const useHeader = () => {
  const { user } = useAuth();
  const [isAccMenuVisible, setIsAccMenuVisible] = useState<boolean>(false);
  const { snackbar, setSnackbar } = useSnackbar();
  const { setLoading } = useLoader();

  const accountRef = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsAccMenuVisible((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      clearSessionStorage(); // Clear any stored session data
      setSnackbar({ type: "success", message: "Succefully Logout" });
      setTimeout(() => {
        if (location.pathname === "/") {
          window.location.reload();
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      const error = err as Error;
      setSnackbar({
        type: "error",
        message:
          error?.message || "Error while signing out. Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogout,
    toggleMenu,
    accountRef,
    navigate,
    location,
    snackbar,
    isAccMenuVisible,
    user,
    setSnackbar,
  };
};

export default useHeader;
