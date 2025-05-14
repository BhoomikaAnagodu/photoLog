import { lazy } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import App from "./App";
import HomePage from "./components/HomePage";

const LoginPage = lazy(() => import("./components/LoginPage"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
];

export const appRouter = createBrowserRouter(routes);
