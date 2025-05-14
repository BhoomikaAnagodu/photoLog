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
