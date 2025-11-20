import { NavLink } from "react-router-dom";

import Logo from "../assets/icons/logo.svg?react";
import Account from "../assets/icons/account.svg?react";
import Logout from "../assets/icons/logout.svg?react";

import useHeader from "../hooks/useHeader";
import SearchComponent from "./SearchComponent";

const Header = () => {
  const {
    handleLogout,
    toggleMenu,
    accountRef,
    isAccMenuVisible,
    user,
    location,
  } = useHeader();
  return (
    <>
      <div className="fixed z-1 top-0 left-0 right-0 shadow bg-white">
        <div className="aspect-auto flex justify-between items-center w-11/12 lg:w-5/6 h-15 mx-auto">
          <div>
            <NavLink to={"/"}>
              <Logo className="w-12 h-10" />
            </NavLink>
          </div>
          {location.pathname === "/" && <SearchComponent />}
          <div>
            <ul>
              {user ? (
                <li className="relative" ref={accountRef}>
                  {user && user?.photoURL ? (
                    <img
                      src={user && user?.photoURL}
                      className="w-6 h-6 rounded-full cursor-pointer"
                      alt="profile picture"
                      onClick={toggleMenu}
                    />
                  ) : (
                    <Account
                      className="w-6 h-6 cursor-pointer"
                      onClick={toggleMenu}
                    />
                  )}
                  {isAccMenuVisible && (
                    <div className="shadow-[0px_0px_90px_10px_rgba(0,_0,_0,_0.1)] rounded-md z-[1100] bg-white absolute top-7 right-0">
                      <ul>
                        <li className="py-2 w-max text-sm px-4 cursor-pointer hover:[&>a>div>svg>path]:fill-stone-50 hover:bg-theme-lilac-900 hover:text-stone-50 rounded-t-md">
                          <NavLink to="/profile">
                            <div className="flex items-center">
                              <Account
                                className="w-5 h-5 mr-2 cursor-pointer"
                                onClick={toggleMenu}
                              />
                              <p>My Profile</p>
                            </div>
                          </NavLink>
                        </li>
                        <li
                          onClick={handleLogout}
                          className="py-2 px-4 text-sm cursor-pointer hover:[&>div>svg>path]:stroke-stone-50 hover:bg-theme-lilac-900 hover:text-stone-50 rounded-b-md"
                        >
                          <div className="flex items-center">
                            <Logout
                              className="w-5 h-5 mr-2 cursor-pointer"
                              onClick={toggleMenu}
                            />
                            <p className="text-left">Logout</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <NavLink to={"/login"}>Login</NavLink>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
