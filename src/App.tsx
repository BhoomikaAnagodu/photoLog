import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainContainer from "./containers/MainContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainContainer />
  </StrictMode>
);
