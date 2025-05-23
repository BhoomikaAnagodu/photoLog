import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="fixed z-1 top-0 left-0 right-0 shadow bg-white">
      <div className="aspect-auto flex justify-between items-center w-5/6 h-15 mx-auto">
        <div>
          <NavLink to={"/"}>
            <p>Logo</p>
          </NavLink>
        </div>
        <div>
          <ul>
            <NavLink to={"/login"}>Login</NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
