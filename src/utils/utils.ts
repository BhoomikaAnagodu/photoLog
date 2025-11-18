export const clearSessionStorage = () => {
  sessionStorage.clear();
};

export const handleAuthErrors = (code: string): string => {
  switch (code) {
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error! Please check your internet connection and try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  callbackFnc: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callbackFnc(...args);
    }, delay);
  };
};

export const base64toBlob = (base64: string) => {
  const splitData = base64.split(",");
  const byteString = atob(splitData[1]); // decode base64
  const mimeString = splitData[0].match(/:(.*?);/)?.[1] || "image/png";

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};
