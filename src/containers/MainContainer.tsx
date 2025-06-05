import { Outlet } from "react-router-dom";
import Header from "./Header";
import { SnackBarProvider } from "../context/SnackBarContext";
import { AuthProvider } from "../context/AuthContext";
import { AppContextProvider } from "../context/AppContext";

const MainContainer = () => {
  return (
    <SnackBarProvider>
      <AuthProvider>
        <AppContextProvider>
          <div className="relative w-full">
            <Header />
            <div className="aspect-auto w-5/6 mx-auto">
              <Outlet />
            </div>
          </div>
        </AppContextProvider>
      </AuthProvider>
    </SnackBarProvider>
  );
};

export default MainContainer;
