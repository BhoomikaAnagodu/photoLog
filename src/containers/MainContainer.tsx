import { Outlet } from "react-router-dom";

const MainContainer = () => {
  return (
    <>
      <h1 className="text-2xl my-10 text-center">Main Container</h1>
      <Outlet />
    </>
  );
};

export default MainContainer;
