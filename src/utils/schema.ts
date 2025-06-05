import type { InputFieldType } from "./type";

export const emailSchema: InputFieldType = {
  id: "email",
  label: "Email",
  type: "email",
  value: "",
  placeholder: "Email",
  validations: [
    { required: true, errMessage: "Required Field" },
    { regex: /^\S+@\S+\.\S+$/, errMessage: "Invalid Email Id" },
  ],
};

export const passwordSchema: InputFieldType = {
  id: "password",
  label: "Password",
  type: "password",
  value: "",
  placeholder: "Password",
  validations: [
    { required: true, errMessage: "Required Field" },
    {
      regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      errMessage:
        "Password must contain 8+ characters, including uppercase, lowercase, digit, special character, and no spaces.",
    },
  ],
};

export const userNameSchema: InputFieldType = {
  id: "userName",
  label: "User Name",
  type: "text",
  value: "",
  placeholder: "User Name",
  validations: [
    { required: true, errMessage: "Required Field" },
    {
      regex: /^[0-9A-Za-z_-]{6,16}$/,
      errMessage:
        "Username must be 6–16 characters long and contain only alphabets, numbers, underscores and hyphens.",
    },
  ],
};

export const confirmPasswordSchema: InputFieldType = {
  id: "confirmPassword",
  label: "Confirm Password",
  type: "password",
  value: "",
  placeholder: "Confirm Password",
  validations: [
    { required: true, errMessage: "Required Field" },
    {
      matchField: "password",
      errMessage: "Passwords do not match.",
    },
  ],
};
