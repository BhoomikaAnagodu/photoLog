import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainContainer from "./containers/MainContainer";
import ErrorBoundary from "./containers/ErrorBoundary";
import HomePage from "./containers/HomePage";
import AuthContainer from "./containers/AuthContainer";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainContainer />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <AuthContainer /> },
    ],
  },
];

export const appRouter = createBrowserRouter(routes);
