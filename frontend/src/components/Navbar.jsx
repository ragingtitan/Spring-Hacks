import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useContext, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import ProfilePictureGenerator from "./ProfilePictureGenerator";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, username, setusername, profilePicture } =
    useContext(AuthContext); // Use useContext to consume AuthContext
  console.log(username);
  const [OpenNavbar, setOpenNavbar] = useState(false);
  const [OpenMobileNavbar, setOpenMobileNavbar] = useState(false);
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        let url = "http://localhost:4000/auth/profilepic";
        const response = await axios.get(url, {
          responseType: "blob",
          withCredentials: true,
        });
        if (response.status === 200) {
          const blob = response.data;
          const url = URL.createObjectURL(blob);
          console.log(response);
          setImageSrc(url);
        } else {
          toast.error(err.message);
          console.error(err.message);
        }
      } catch (error) {
        toast.error("Error fetching image:", error.message);
        console.error("Error fetching image:", error.message);
      }
    };

    fetchImage();

    // Cleanup URL object when component unmounts
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [isLoggedIn, navigate]);


  const handleLogout = () => {
    console.log("clicked");
    let url = "http://localhost:4000/auth/logout";
    axios.defaults.withCredentials = true;
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          toast.success("Logged out successfully");
          setIsLoggedIn(false);
          navigate("/signin");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Hide dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed w-full z-50 lg:navbar ${
        location.pathname === "/ainotesmaker" ? "hidden" : ""
      }`}
    >
      <div className="flex justify-between w-full">
        <nav
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600  p-6`}
        >
          <button
            onClick={() => {
              setOpenMobileNavbar(!OpenMobileNavbar);
            }}
            className={`top-2 fixed right-2 md:hidden lg:hidden bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg`}
          >
            <svg
              className=""
              width={22}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
          <div
            className={`container md:flex lg:flex mx-auto hidden justify-between items-center ${
              OpenNavbar ? "" : "hidden"
            }`}
          >
            {/* Title Section */}
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              <Link to="/">
                Notes Maker <span className="text-blue-300">AI</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`${
                  location.pathname === "/" ? "text-blue-400" : "text-white"
                } relative  text-lg font-medium hover:text-blue-300 transition duration-300`}
              >
                Home
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 scale-x-0 origin-left transition transform duration-300 hover:scale-x-100"></div>
              </Link>
              <Link
                className={`${
                  location.pathname === "/tutorial"
                    ? "text-blue-400"
                    : "text-white"
                } relative  text-lg font-medium hover:text-blue-300 transition duration-300`}
                to="/tutorial"
              >
                How it Works?
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 scale-x-0 origin-left transition transform duration-300 hover:scale-x-100"></div>
              </Link>
              <Link
                to="/signin"
                className={`${isLoggedIn ? "hidden" : ""} ${
                  location.pathname === "/signup" ||
                  location.pathname === "/signin"
                    ? "text-blue-400"
                    : "text-white"
                } relative  text-lg font-medium hover:text-blue-300 transition duration-300`}
              >
                Sign in
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 scale-x-0 origin-left transition transform duration-300 hover:scale-x-100"></div>
              </Link>
              <Link
                to="/pricing"
                className={`${
                  location.pathname === "/pricing"
                    ? "text-blue-400"
                    : "text-white"
                } relative  text-lg font-medium hover:text-blue-300 transition duration-300`}
              >
                Pricing
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 scale-x-0 origin-left transition transform duration-300 hover:scale-x-100"></div>
              </Link>
              <Link
                to="/contact"
                className={`${
                  location.pathname === "/contact"
                    ? "text-blue-400"
                    : "text-white"
                } relative  text-lg font-medium hover:text-blue-300 transition duration-300`}
              >
                Contact
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 scale-x-0 origin-left transition transform duration-300 hover:scale-x-100"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => {
                  setOpenNavbar(!OpenNavbar);
                }}
                className="outline-none mobile-menu-button"
              ></button>
            </div>
            <div
              ref={dropdownRef}
              className={` relative ${isLoggedIn ? "" : "hidden"} `}
            >
              <div className="">
                <div
                  className="flex justify-center items-center rounded-full"
                  onClick={toggleDropdown}
                >
                  <div
                    className={`profile-pic overflow-hidden p-1 rounded-full bg-white shadow-lg cursor-pointer border-[3px] ${
                      location.pathname === "/dashboard"
                        ? "border-blue-400 "
                        : "border-white"
                    }`}
                  >
                    {/* <ProfilePictureGenerator seed = {username} width={30} /> */}
                    <div className="">
                      {!profilePicture ? (
                        <ProfilePictureGenerator seed={username} width={30} />
                      ) : (
                        <img
                          src={imageSrc}
                          className="w-[2.25rem] overflow-hidden"
                          alt="Profile"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-18 md:right-2 lg:right-2 mt-2 w-48 bg-white rounded-lg shadow-md z-20 text-black font-semibold shadow-blue-500 p-2 ">
                  <ul className="flex flex-col items-center gap-2">
                    <Link
                      onClick={closeDropdown}
                      className={`px-4 w-11/12 text-center py-2 hover:bg-indigo-600 hover:text-gray-200 rounded cursor-pointer duration-200 ${
                        location.pathname === "/dashboard"
                          ? "bg-indigo-500 text-white"
                          : ""
                      }`}
                      to="/dashboard"
                    >
                      Profile
                    </Link>
                    <Link
                      onClick={closeDropdown}
                      className={`px-4 w-11/12 text-center py-2 hover:bg-indigo-600 hover:text-gray-200 rounded cursor-pointer duration-200 ${
                        location.pathname === "/settings"
                          ? "bg-indigo-500 text-white"
                          : ""
                      }`}
                      to="/settings"
                    >
                      Settings
                    </Link>
                    <button
                      className={`px-4 w-11/12 text-center py-2 hover:bg-red-600 duration-200 hover:text-gray-200 rounded cursor-pointer ${
                        location.pathname === "/" ? "" : ""
                      }`}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={` right-0 duration-150 mobile-menu top-0 fixed md:hidden lg:hidden`}
      >
        <button
          onClick={() => {
            setOpenMobileNavbar(!OpenMobileNavbar);
          }}
          className={`${
            OpenMobileNavbar ? "z-10" : "hidden"
          } p-2 transition duration-300 fixed top-2 right-2`}
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <ul
          className={`${
            OpenMobileNavbar ? "w-full p-6" : "w-0"
          } bg-gradient-to-r from-blue-500 to-purple-600 text-center right-0 h-full duration-100 mobile-menu top-0 fixed md:hidden lg:hidden flex flex-col gap-1`}
        >
          <div className="text-3xl text-center md:text-2xl lg:text-3xl font-bold my-4 text-white">
            <Link
              onClick={() => {
                setOpenMobileNavbar(false);
              }}
              to="/"
            >
              <span className="text-blue-300">AI</span> Notes Maker
            </Link>
          </div>
          <div
            onClick={toggleDropdown}
            className={`flex justify-center items-center p-1 `}
          >
            <div
              className={`profile-pic overflow-hidden ${isLoggedIn ? "" : "hidden"} ${
                OpenMobileNavbar ? "" : "hidden"
              } my-5 p-1 rounded-xl bg-white shadow-lg cursor-pointer ${
                isDropdownOpen ? "border-4 border-blue-400" : "border-4"
              }`}
            >
              <div className="">
                      {!profilePicture ? (
                        <ProfilePictureGenerator seed={username} width={30} />
                      ) : (
                        <img
                          src={imageSrc}
                          className="w-[10em] overflow-hidden"
                          alt="Profile"
                        />
                      )}
                    </div>
            </div>
            {isDropdownOpen && (
              <div
                className={`absolute right-6 mt-2 w-40 bg-white rounded-lg shadow-lg font-semibold z-[14314] text-black p-2 `}
              >
                <ul className="flex flex-col items-center">
                  <Link
                    className="px-4 w-11/12 text-center py-2 hover:bg-indigo-600 hover:text-gray-200 rounded cursor-pointer"
                    to="/dashboard"
                  >
                    Profile
                  </Link>
                  <Link
                    className="px-4 w-11/12 text-center py-2 hover:bg-indigo-600 hover:text-gray-200 rounded cursor-pointer"
                    to="/settings"
                  >
                    Settings
                  </Link>
                  <button
                    className="px-4 w-11/12 text-center py-2 hover:bg-indigo-600 hover:text-gray-200 rounded cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </ul>
              </div>
            )}
          </div>
          <div className={`h-full justify-center flex flex-col gap-10`}>
            <li>
              <Link
                onClick={() => {
                  setOpenMobileNavbar(false);
                }}
                to="/"
                className={`rounded-lg block text-white text-lg px-4 py-2 hover:bg-blue-700 transition duration-300 ${
                  location.pathname === "/" ? "bg-blue-700" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setOpenMobileNavbar(false);
                }}
                to="/tutorial"
                className={`rounded-lg block text-white text-lg px-4 py-2 hover:bg-blue-700 transition duration-300 ${
                  location.pathname === "/tutorial" ? "bg-blue-700" : ""
                }`}
              >
                How It Works?
              </Link>
            </li>
            <li className={`${isLoggedIn ? "hidden" : ""}`}>
              <Link
                onClick={() => {
                  setOpenMobileNavbar(false);
                }}
                to="/signin"
                className={` rounded-lg block text-white text-lg px-4 py-2 hover:bg-blue-700 transition duration-300 ${
                  location.pathname === "/signin" ? "bg-blue-700" : ""
                }`}
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setOpenMobileNavbar(false);
                }}
                to="/pricing"
                className={`rounded-lg block text-white text-lg px-4 py-2 hover:bg-blue-700 transition duration-300 ${
                  location.pathname === "/pricing" ? "bg-blue-700" : ""
                }`}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  setOpenMobileNavbar(false);
                }}
                to="/contact"
                className={`rounded-lg block text-white text-lg px-4 py-2 hover:bg-blue-700 transition duration-300 ${
                  location.pathname === "/contact" ? "bg-blue-700" : ""
                }`}
              >
                Contact
              </Link>
            </li>
            <li>
              <div className="">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg font-semibold hover:bg-blue-700 transition duration-300 hover:scale-105">
                  Docs
                </button>
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
