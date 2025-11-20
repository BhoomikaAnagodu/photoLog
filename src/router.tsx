import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainContainer from "./containers/MainContainer";
import ErrorBoundary from "./containers/ErrorBoundary";
import HomePage from "./containers/HomePage";
import AuthForm from "./containers/AuthForm";
import ProfilePage from "./containers/Profile/ProfilePage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainContainer />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <AuthForm /> },
      { path: "/signup", element: <AuthForm isSignup={true} /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },
];

export const appRouter = createBrowserRouter(routes);
