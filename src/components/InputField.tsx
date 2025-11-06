import { useState } from "react";
import Hide_Password from "../assets/icons/hide_password.svg?react";
import Show_Password from "../assets/icons/show_password.svg?react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: string;
}

const InputField = ({
  className = "",
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  error,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block font-semibold text-xs text-gray-700 my-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={isPasswordType && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full border px-3 py-2 text-sm rounded focus:shadow-outline outline-theme-lilac placeholder:text-slate-300 focus:ring ${
            error ? "border-red-500" : "border-slate-300"
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePassword}
            tabIndex={-1}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
          >
            {showPassword ? (
              <Show_Password className="w-4 h-4" />
            ) : (
              <Hide_Password className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs my-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
