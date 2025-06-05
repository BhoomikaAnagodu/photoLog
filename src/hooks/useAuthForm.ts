import { useEffect, useState } from "react";
import type { AuthFormSchema } from "../utils/type";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import auth from "../services/auth";
import { useNavigate } from "react-router-dom";
import { handleAuthErrors } from "../utils/utils";
import { useSnackbar } from "../context/SnackBarContext";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
  userNameSchema,
} from "../utils/schema";

interface Props {
  isSignup: boolean;
  isModal?: boolean;
}

const useAuthForm = ({ isSignup, isModal }: Props) => {
  const [formSchema, setFormSchema] = useState<AuthFormSchema>({
    email: emailSchema,
    password: passwordSchema,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSignupForm, setShowSignupForm] = useState<boolean>(isSignup);

  const { setSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const validateField = (fields: AuthFormSchema) => {
    const errors: Record<string, string> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(fields).forEach(([key, field]: [string, any]) => {
      const value = field.value;
      const validations = field.validations || [];

      for (const rule of validations) {
        if (rule.required && !value) {
          errors[key] = rule.errMessage;
          break;
        }

        if (rule.regex && value && !rule.regex.test(value)) {
          errors[key] = rule.errMessage;
          break;
        }

        if (
          rule.matchField &&
          value !== fields[rule.matchField as keyof AuthFormSchema]?.value
        ) {
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
      (fieldError) => !fieldError?.trim()
    );

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const email = formSchema.email.value;
      const password = formSchema.password.value;
      const userName = formSchema?.userName?.value;

      let userCredential;
      if (showSignupForm) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      const user = userCredential.user;
      if (showSignupForm) {
        await updateProfile(userCredential.user, {
          displayName: userName,
        });
      }
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
        autoDismiss: false,
      });
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        type: "error",
        message: handleAuthErrors(error.code),
        autoDismiss: false,
      });
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    setFormSchema((prev) => {
      const { confirmPassword, userName, ...rest } = prev;

      if (showSignupForm && !userName && !confirmPassword) {
        return {
          userName: userNameSchema,
          ...rest,
          confirmPassword: confirmPasswordSchema,
        };
      }

      if (!showSignupForm) {
        return {
          ...rest,
        };
      }
      return prev;
    });
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
