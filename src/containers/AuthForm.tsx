import InputField from "../components/InputField";
import type { AuthFormSchema } from "../utils/type";
import useAuthForm from "../hooks/useAuthForm";
import type { User } from "firebase/auth";

interface Props {
  isSignup?: boolean;
  isModal?: boolean;
  handleLoginClose?: (user: User) => void;
}

const AuthForm = ({
  isSignup = false,
  isModal = false,
  handleLoginClose,
}: Props) => {
  const {
    formSchema,
    formErrors,
    handleOnChange,
    handleSubmit,
    isSubmitting,
    handleNavigation,
    showSignupForm,
  } = useAuthForm({ isSignup, isModal, handleLoginClose });

  const entries = Object.entries(formSchema) as [
    keyof AuthFormSchema,
    (typeof formSchema)[keyof AuthFormSchema]
  ][];

  return (
    <div
      className={`bg-white border-stone-600 grid place-items-center ${
        isModal ? "" : "h-dvh"
      }`}
    >
      <div
        className={`${
          isModal ? "w-full" : "w-full md:w-4/6 lg:w-5/12"
        } mx-auto p-5`}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl md:text-3xl text-gray-700 text-center py-1 font-bold tracking-wide">
            {showSignupForm ? "Sign up" : "Login"}
          </h1>
          {entries.map(([key, field]) => (
            <div key={field?.id} className="my-4">
              <InputField
                label={field?.label}
                id={field?.id}
                type={field?.type}
                value={field?.value}
                placeholder={field?.placeholder}
                onChange={(e) =>
                  handleOnChange(e.target.value, key as keyof AuthFormSchema)
                }
                error={formErrors[key]}
              />
            </div>
          ))}
          <div className="text-center py-1 my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-theme-lilac disabled:bg-stone-300 px-32 cursor-pointer py-2 rounded-3xl text-stone-50 hover:bg-theme-lilac-900 font-semibold tracking-wide"
            >
              {showSignupForm ? "Sign up" : "Login"}
            </button>
          </div>

          <div className="my-1 text-center">
            {showSignupForm ? (
              <p className="text-gray-500">
                Already have a account?{" "}
                <span
                  className="hover:underline text-theme-lilac cursor-pointer"
                  onClick={() => handleNavigation("login")}
                >
                  Login
                </span>
              </p>
            ) : (
              <p className="text-gray-500">
                Don't have a account{" "}
                <span
                  className="hover:underline text-theme-lilac cursor-pointer"
                  onClick={() => handleNavigation("signup")}
                >
                  Register
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
