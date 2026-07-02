import React, { useState, useEffect, useContext } from "react";
import hostelLogo from "../assets/hostel-logo-hotel-logo-travel-rest-place-vector-illustration-97549145.webp";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import AuthContext from "../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showMenu]);

  // ---------------- ROLE BASED LINKS ----------------
  const studentLinks = [
    { to: "/", label: "HOME" },
    { to: "/register-complaints", label: "REGISTER COMPLAINTS" },
    { to: "/all-complaints", label: "ALL COMPLAINTS" },
    { to: "/checknotice", label: "NOTICES" },  
    { to: "/contact", label: "CONTACT" },
  ];

  const supervisorLinks = [
    { to: "/", label: "HOME" },
    { to: "/supervisor", label: "STUDENT COMPLAINTS" },
    { to: "/register-student", label: "REGISTER STUDENT" },
    { to: "/supervisor/students", label: "ALL STUDENTS" },
    { to: "/publishNotice", label: "PUBLISH NOTICE" },
    { to: "/checknotice", label: "NOTICES" },  
  ];

  const links = user?.role === "Supervisor" ? supervisorLinks : studentLinks;

  const linkClasses =
    "py-1 text-richblack-600 hover:text-blue-200 transition-colors duration-200";
  const activeClasses = "text-blue-200 border-b-2 border-blue-200";

  return (
    <div className="border-b border-pure-greys-25 bg-white">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto font-inter">
        {/* LOGO */}
        <img
          onClick={() => navigate("/")}
          className="w-32 cursor-pointer"
          src={hostelLogo}
          alt="Hostel Logo"
        />

        {/* DESKTOP LINKS */}
        <ul className="hidden md:flex items-center gap-10 font-medium">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/supervisor"}
              className={({ isActive }) =>
                isActive ? `${linkClasses} ${activeClasses}` : linkClasses
              }
            >
              <li>{item.label}</li>
            </NavLink>
          ))}
        </ul>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <span className="text-gray-400 font-medium">Loading...</span>
          ) : user ? (
            <>
              <span className="text-richblack-700 font-medium">
                Hi, {user.name}
              </span>
              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-lg bg-blue-200 text-white hover:bg-blue-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-1.5 rounded-lg bg-blue-200 text-white hover:bg-blue-300 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE MENU ICON */}
        <div className="md:hidden text-richblack-700">
          <AiOutlineMenu
            size={26}
            className="cursor-pointer"
            onClick={() => setShowMenu(true)}
          />
        </div>

        {/* MOBILE OVERLAY */}
        {showMenu && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setShowMenu(false)}
          />
        )}

        {/* MOBILE DRAWER */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-[80%] max-w-sm bg-richblack-5 z-40 transition-transform duration-300 ${
            showMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <img src={hostelLogo} className="w-28" alt="Hostel Logo" />
            <AiOutlineClose
              size={26}
              className="cursor-pointer text-richblack-700"
              onClick={() => setShowMenu(false)}
            />
          </div>

          {/* MOBILE LINKS */}
          <ul className="flex flex-col items-center gap-6 mt-8 text-lg font-medium">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/supervisor"}
                onClick={() => setShowMenu(false)}
                className="w-full text-center"
              >
                <li className="mx-6 py-3 rounded-xl hover:bg-blue-5 hover:text-blue-200 transition">
                  {item.label}
                </li>
              </NavLink>
            ))}

            {/* MOBILE AUTH */}
            {loading ? (
              <span className="text-gray-400 mt-4">Loading...</span>
            ) : user ? (
              <button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="mt-4 w-4/5 py-3 rounded-xl bg-blue-200 text-white"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="mt-4 w-4/5 py-3 rounded-xl bg-blue-200 text-white"
              >
                Login
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
