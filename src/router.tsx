import { createBrowserRouter, type RouteObject } from "react-router-dom";
import MainContainer from "./containers/MainContainer";
import ErrorBoundary from "./containers/ErrorBoundary";
import HomePage from "./containers/HomePage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainContainer />,
    errorElement: <ErrorBoundary />,
    children: [{ path: "/", element: <HomePage /> }],
  },
];

export const appRouter = createBrowserRouter(routes);
