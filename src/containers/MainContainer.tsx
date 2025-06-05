import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainContainer = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default MainContainer;
