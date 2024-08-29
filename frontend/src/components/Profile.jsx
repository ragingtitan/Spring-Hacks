import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfilePictureGenerator from "./ProfilePictureGenerator";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
const ProfileIcon = ({ width }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:4000/auth/logout")
      .then((res) => {
        if (res.data.status) {
          toast.success("Logged out successfully");
          setisloggedin(false);
          navigate("/signin");
        } else {
          toast.error("Failed to logout");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isloggedin, setisloggedin, username, setusername } =
    useContext(AuthContext);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className={`relative inline-block text-left ${
        username ? "block" : "hidden"
      }`}
    >
      <div className="">
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white focus:outline-none"
          onClick={toggleDropdown}
        >
          <div>
            <ProfilePictureGenerator width={width} seed={username} />
          </div>
        </button>
      </div>

      {dropdownOpen && (
        <div className="origin-top-right absolute top-14 right-0 mt-2 w-48 rounded-md shadow-xl bg-white ring-2 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <p className="text-center text-[1.1rem] bg-indigo-600 rounded text-gray-300 p-2">
                {username}
              </p>
            </Link>
            <div
              type="button"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setDropdownOpen(false);
              }}
            >
              {isloggedin ? (
                <button
                  className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
