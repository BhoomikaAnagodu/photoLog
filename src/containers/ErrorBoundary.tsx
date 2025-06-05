import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Error Msg", error);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-semibold">Error {error.status}</h1>
        <p className="text-lg">{error.statusText}</p>
      </div>
    );
  }

  // Fallback for unexpected errors
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-lg">
        {(error as Error)?.message || "Unknown error occurred."}
      </p>
    </div>
  );
};

export default ErrorBoundary;
