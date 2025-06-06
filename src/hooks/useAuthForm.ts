import { useEffect, useState } from "react";
import type { AuthFormSchema, InputFieldType } from "../utils/type";
import { useNavigate } from "react-router-dom";
import { handleAuthErrors } from "../utils/utils";
import { useSnackbar } from "../context/SnackBarContext";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
  userNameSchema,
} from "../utils/schema";
import { loginUser, registerUser } from "../networks/auth";
import { updateUserProfile } from "../networks/user";
import type { User } from "firebase/auth";

interface Props {
  isSignup: boolean;
  isModal?: boolean;
  handleLoginClose?: (user: User) => void;
}

const useAuthForm = ({ isSignup, isModal, handleLoginClose }: Props) => {
  const [formSchema, setFormSchema] = useState<AuthFormSchema>({
    email: emailSchema,
    password: passwordSchema,
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof AuthFormSchema, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSignupForm, setShowSignupForm] = useState<boolean>(isSignup);

  const { setSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const validateField = (fields: AuthFormSchema) => {
    const errors: Partial<Record<keyof AuthFormSchema, string>> = {};

    (
      Object.entries(fields) as [keyof AuthFormSchema, InputFieldType][]
    ).forEach(([key, field]) => {
      const { value, validations = [] } = field;

      for (const rule of validations) {
        if (rule.required && !value.trim()) {
          errors[key] = rule.errMessage;
          break;
        }

        if (rule.regex && value && !rule.regex.test(value)) {
          errors[key] = rule.errMessage;
          break;
        }

        if (rule.matchField && value !== fields[rule.matchField]?.value) {
          errors[key] = rule.errMessage;
          break;
        }
      }
    });

    return errors;
  };

  const handleOnChange = (value: string, id: keyof AuthFormSchema) => {
    setFormSchema((prev) => ({
      ...prev,
      [id]: { ...prev[id], value },
    }));

    setFormErrors((prev) => {
      if (prev[id]) {
        const errors = { ...prev };
        delete errors[id];
        return errors;
      }
      return prev;
    });
  };

  // Function to Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields on submit
    const updatedErrors = validateField(formSchema);
    setFormErrors(updatedErrors);

    // Check if there are no errors before allowing submission
    const isValid = Object.values(updatedErrors).every(
      (fieldError) => !fieldError || fieldError.trim() === ""
    );

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const { email, password, userName } = formSchema;
      const emailValue = email.value;
      const passwordValue = password.value;

      let userCredential;
      if (showSignupForm) {
        userCredential = await registerUser(emailValue, passwordValue);
        if (userName?.value) {
          await updateUserProfile(userCredential.user, {
            displayName: userName.value,
          });
        }
      } else {
        userCredential = await loginUser(emailValue, passwordValue);
      }
      const { user } = userCredential;
      const token = await user.getIdToken();

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          accessToken: token,
        })
      );

      setSnackbar({
        type: "success",
        message: showSignupForm ? "Successful Signup" : "Successful Login",
      });

      if (isModal) {
        handleLoginClose?.(user);
      } else {
        navigate("/");
      }
    } catch (error) {
      const err = error as { code?: string };
      setSnackbar({
        type: "error",
        message: handleAuthErrors(err.code ?? ""),
        autoDismiss: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormSchema(() => {
      if (showSignupForm) {
        return {
          userName: userNameSchema,
          email: emailSchema,
          password: passwordSchema,
          confirmPassword: confirmPasswordSchema,
        };
      } else {
        return {
          email: emailSchema,
          password: passwordSchema,
        };
      }
    });
    setFormErrors({});
  }, [showSignupForm]);

  useEffect(() => {
    setShowSignupForm(isSignup);
  }, [isSignup]);

  const handleNavigation = (pageName: string) => {
    if (isModal) {
      if (pageName === "signup") {
        setShowSignupForm(true);
      } else {
        setShowSignupForm(false);
      }
    } else {
      navigate(`/${pageName}`, { replace: true });
    }
  };

  return {
    formSchema,
    formErrors,
    handleOnChange,
    handleSubmit,
    isSubmitting,
    handleNavigation,
    showSignupForm,
  };
};

export default useAuthForm;
