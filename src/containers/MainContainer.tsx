import { Outlet } from "react-router-dom";
import Header from "./Header";
import { SnackBarProvider } from "../context/SnackBarContext";
import { AuthProvider } from "../context/AuthContext";
import { AppContextProvider } from "../context/AppContext";
import { LoaderProvider } from "../context/LoaderContext";

const MainContainer = () => {
  return (
    <LoaderProvider>
      <SnackBarProvider>
        <AuthProvider>
          <AppContextProvider>
            <div className="relative w-full">
              <Header />
              <div className="aspect-auto w-11/12 lg:w-5/6 mt-20 mx-auto">
                <Outlet />
              </div>
            </div>
          </AppContextProvider>
        </AuthProvider>
      </SnackBarProvider>
    </LoaderProvider>
  );
};

export default MainContainer;
