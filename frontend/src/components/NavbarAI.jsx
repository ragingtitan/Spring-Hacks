import React from "react";
import { useState, useContext, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import newchat_logo from "../assets/newchat_logo.svg";
import dropdown_icon from "../assets/dropdown_icon.svg";
import { useCurrentChat } from "./ChatContext";
import { AuthContext } from "./AuthContext";
import ProfilePictureGenerator from "./ProfilePictureGenerator";
import { Link, useLocation, useNavigate } from "react-router-dom";
const Navbar = () => {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [currentCollection, setCurrentCollection] = useState("");
  const [openModel, setopenModel] = useState(false);
  const { currentModel, setCurrentModel } = useCurrentChat();
  const [OpenNavbar, setOpenNavbar] = useState(false);
  const [OpenMobileNavbar, setOpenMobileNavbar] = useState(false);
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, username, profilePicture} = useContext(AuthContext); 
  const [imageSrc, setImageSrc] = useState("");
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
          toast.error(error.message);
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

  const newCollections = async () => {
    const name = prompt("Enter chat name: ");
    if (!name || name.length === 0) {
      toast.error("Chat name cannot be empty!");
      return;
    }
    setCollectionName(name);
    const url = "http://localhost:4000/app/newCollection";
    try {
      const res = await axios.post(
        url,
        { collectionName: name },
        {
          withCredentials: true,
        }
      );
      if (res.data.status) {
        toast.success(res.data.message);
        getCollections();
        getCurrentCollection();
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getCurrentCollection = async () => {
    const url = "http://localhost:4000/app/setCurrentCollection";
    try {
      const res = await axios.post(
        url,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.status) {
        setCurrentCollection(res.data.currentCollectionName);
        localStorage.setItem("currentChat", res.data.currentCollectionName);
        console.log(res.data.currentCollectionName);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getCollections = async () => {
    try {
      const url = "http://localhost:4000/app/collections";
      const response = await axios.get(url, {
        withCredentials: true,
      });
      if (response.data.collections !== "users") {
        setCollections(response.data.collections);
      }
    } catch (err) {
      console.error("Error fetching collections:", err.message);
    }
  };
  const model = localStorage.getItem("model");
  if (!model) {
    localStorage.setItem("model", "lite");
  }
  const handleOptionChange = (event) => {
    setCurrentModel(event.target.value);
    localStorage.setItem("model", event.target.value);
  };

  return (
    <div className="navbar flex justify-between items-center w-full bg-[#212121] h-fit fixed top-0 left-0">
      <nav>
        <ul>
          <li>
            <div className="flex items-center mx-2 justify-between gap-2">
              <div className="buttons-wrapper items-center gap-2 flex">
                {/* <button
                  onClick={newCollections}
                  title="New Chat"
                  className={`newchat p-2 transition-all duration-300 btn-neutral btn-small flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg`}
                >
                  <div className="flex w-full items-center justify-center gap-2">
                    <img src={newchat_logo} alt="" />
                  </div>
                </button> */}
                <div
                  title="Select version"
                  className={`p-2 model-selection my-1 transition-all duration-300 hover:bg-token-main-surface-secondary radix-state-open:bg-token-main-surface-secondary group flex cursor-pointer items-center gap-1 rounded-xl px-3 py-2 text-lg font-medium ${
                    openModel
                      ? "border-white border-[1px]"
                      : "border-[#212121] border-[1px]"
                  }`}
                  type="button"
                  id="radix-:raq:"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  data-state="closed"
                >
                  <button
                    className={`flex items-center justify-center `}
                    onClick={() => {
                      setopenModel(!openModel);
                    }}
                  >
                    <div>Notes Maker AI</div>
                    <img src={dropdown_icon} alt="" />
                  </button>
                </div>
              </div>
              <div className="dark-mode hidden">
                <button
                  title="Toggle Theme"
                  className="dark-mode-btn w-12 h-6 rounded-full p-1 bg-gray-400 dark:bg-gray-600 relative transition-colors duration-300 ease-in focus:outline-none focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-600 focus:border-transparent"
                >
                  <div
                    id="toggle"
                    className="rounded-full w-4 h-4 bg-gray-900 dark:bg-blue-500 relative ml-0 dark:ml-6 pointer-events-none transition-all duration-300 ease-out"
                  ></div>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <div
        className={`dropdown-selection transition-all duration-200 flex justify-center flex-col w-fit p-1 fixed top-14 left-12 rounded-xl z-50 ${
          openModel ? "flex flex-col" : "hidden"
        }`}
      >
        <ul>
          <li className="p-2 flex gap-2">
            <label htmlFor="lite">Basic Model</label>
            <input
              checked={currentModel === "lite"}
              onChange={handleOptionChange}
              className="hover:cursor-pointer"
              value="lite"
              id="jarvis-lite"
              type="radio"
              name="lite"
              disabled
            />
          </li>
          <li className="p-2 flex gap-2">
            <label htmlFor="advanced">Advanced Model</label>
            <input
              checked={currentModel === "advanced"}
              onChange={handleOptionChange}
              className="hover:cursor-pointer"
              value="advanced"
              id="jarvis-advanced"
              type="radio"
              name="advanced"
              
            />
          </li>
        </ul>
      </div>
        <div className="p-2 mr-2">
          <div
            ref={dropdownRef}
            className={` relative ${isLoggedIn ? "" : "hidden"} `}
          >
            <div className={`${OpenMobileNavbar ? "hidden" : ""}`}>
              <div
                className="flex justify-center items-center rounded-full"
                onClick={toggleDropdown}
              >
                <div
                  className={`profile-pic p-1 overflow-hidden rounded-full bg-white shadow-lg cursor-pointer border-[3px] ${
                    location.pathname === "/dashboard"
                      ? "border-blue-400 "
                      : "border-white"
                  }`}
                >
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
    </div>
  );
};

export default Navbar; 