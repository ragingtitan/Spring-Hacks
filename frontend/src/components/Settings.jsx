import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPencilAlt, FaTimes } from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setIsLoggedIn,
    username,
    setusername,
    dashboardEmail,
    setdashboardEmail,
    theme,
    settheme,
    autoSave,
    setautoSave,
    lang,
    setlang,
    emailUpdate,
    setemailUpdate,
    twoFactorAuth,
    settwoFactorAuth,
  } = useContext(AuthContext);

  const [editingUsername, seteditingUsername] = useState(false);
  const [formdata, setformdata] = useState({
    username: username,
    theme: theme,
    autoSave: autoSave,
    emailUpdate: emailUpdate,
    lang: lang,
    twoFactorAuth: twoFactorAuth,
  });
  const [originalUsername, setoriginalUsername] = useState(username);
  const [hasChanged, sethasChanged] = useState(false);

  const handleChangeUsername = (e) => {
    const { value } = e.target;
    sethasChanged(true);
    setformdata((prevData) => ({ ...prevData, username: value }));
    console.log("Username changed to:", value); // Debugging log
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    sethasChanged(true);
    setformdata((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(`${name} changed to:`, type === "checkbox" ? checked : value); // Debugging log
  };

  const handleToggle = (name) => {
    setformdata((prevData) => ({
      ...prevData,
      [name]: !prevData[name],
    }));
    sethasChanged(true);
    console.log(`${name} toggled to:`, !formdata[name]); // Debugging log
  };

  useEffect(() => {
    let url = "http://localhost:4000/auth/verify/";
    axios.defaults.withCredentials = true;
    axios
      .get(url)
      .then((res) => {
        if (res.data.status) {
          setIsLoggedIn(true);
          settheme(res.data.settings.theme);
          setautoSave(res.data.settings.autoSave);
          setemailUpdate(res.data.settings.emailUpdate);
          setlang(res.data.settings.lang);
          settwoFactorAuth(res.data.settings.twoFactorAuth);
          setdashboardEmail(res.data.details.email);
          setusername(res.data.details.username);
          setformdata({
            username: res.data.details.username,
            theme: res.data.settings.theme,
            autoSave: res.data.settings.autoSave,
            emailUpdate: res.data.settings.emailUpdate,
            lang: res.data.settings.lang,
            twoFactorAuth: res.data.settings.twoFactorAuth,
          });
        } else {
          toast.error("Not logged in");
          setIsLoggedIn(false);
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(err.message);
      });
  }, []); // Runs once on component mount

  const updateProfile = (e) => {
    e.preventDefault();
    console.log("Update Profile triggered"); // Debugging log
    if (hasChanged) {
      const url = "http://localhost:4000/auth/updateSettings/";
      axios
        .post(url, formdata)
        .then((res) => {
          if (res.data.status) {
            toast.success("Settings updated successfully!");
            setusername(formdata.username); // Update username in AuthContext
            setoriginalUsername(formdata.username); // Update the original username
            sethasChanged(false);
            seteditingUsername(false); // Exit editing mode
            console.log("Profile updated successfully:", formdata); // Debugging log
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err.message);
          toast.error(err.message);
        });
    } else {
      toast.info("No changes made.");
    }
  };

  const cancelEditUsername = () => {
    setformdata((prevData) => ({ ...prevData, username: originalUsername }));
    seteditingUsername(false);
    console.log("Editing canceled, reverted to:", originalUsername); // Debugging log
  };

  const handleDeleteAccount = () => {
    const url = "http://localhost:4000/auth/delete";
    axios
      .get(url)
      .then((res) => {
        if (res.data.status) {
          toast.success("Account deleted successfully!");
          setIsLoggedIn(false);
          navigate("/signin"); // Redirect to Sign In page
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(err.message);
      });
  };
  return (
    <div className=" bg-gray-100 h-screen p-8 pt-12">
      <div className="fixed lg:top-28 lg:left-4 md:top-28 top-16  left-2">
        <Link
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white p-3 rounded shadow-lg hover:bg-indigo-500 transition"
        >
          Go Back
        </Link>
      </div>
      <div className="container h-full flex flex-col justify-center mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center my-2">
          Settings
        </h2>
        <form onSubmit={updateProfile}>
          {/* Account Settings */}
          <div className="mb-8 flex flex-col">
            <h3 className="text-2xl font-medium text-gray-700 mb-4">
              Account Settings
            </h3>
            <div className="flex flex-col w-1/2 gap-2">
              <div className="flex gap-2 items-center">
                <label className="text-gray-600 mb-2">Username</label>
                <input
                  type="text"
                  className={`${
                    editingUsername ? "bg-gray-100 border border-gray-300" : ""
                  } rounded-lg px-4 py-2 text-black`}
                  disabled={!editingUsername}
                  value={formdata.username}
                  onChange={handleChangeUsername}
                />
                {!editingUsername ? (
                  <button
                    onClick={() => seteditingUsername(true)}
                    className="text-black w-[10px]"
                  >
                    <FaPencilAlt />
                  </button>
                ) : (
                  <button
                    onClick={cancelEditUsername}
                    className="text-black w-[10px]"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  className="bg-gray-100 border outline-none border-none text-black border-gray-300 rounded-lg px-4 py-2"
                  value={dashboardEmail}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-medium text-gray-700 mb-4 my-2">
              Settings
            </h3>
            <div className="space-y-6 flex flex-col gap-4">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Theme</span>
                <div
                  className={`relative flex items-center cursor-pointer ${
                    formdata.theme ? "text-blue-600 " : "text-gray-600"
                  }`}
                  onClick={() => handleToggle("theme")}
                >
                  <div
                    className={`${
                      formdata.theme ? "bg-blue-600" : "bg-gray-200"
                    } w-12 h-6 rounded-full shadow-inner duration-150 relative`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formdata.theme}
                      readOnly
                    />
                    <div
                      className={`absolute w-6 h-6 border border-gray-300 rounded-full shadow transform transition-transform ${
                        formdata.theme
                          ? "translate-x-6 bg-gray-200"
                          : "translate-x-0 bg-blue-600"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Auto-Save */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Auto-Save</span>
                <div
                  className={`relative flex items-center cursor-pointer ${
                    formdata.autoSave ? "text-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => handleToggle("autoSave")}
                >
                  <div
                    className={`${
                      formdata.autoSave ? "bg-blue-600" : "bg-gray-200"
                    } w-12 h-6 rounded-full shadow-inner duration-150 relative`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formdata.autoSave}
                      readOnly
                    />
                    <div
                      className={`absolute w-6 h-6 border border-gray-300 rounded-full shadow transform transition-transform ${
                        formdata.autoSave
                          ? "translate-x-6 bg-gray-200"
                          : "translate-x-0 bg-blue-600"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Email Updates */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Email Updates</span>
                <div
                  className={`relative flex items-center cursor-pointer ${
                    formdata.emailUpdate ? "text-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => handleToggle("emailUpdate")}
                >
                  <div
                    className={`${
                      formdata.emailUpdate ? "bg-blue-600" : "bg-gray-200"
                    } w-12 h-6 rounded-full shadow-inner duration-150 relative`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formdata.emailUpdate}
                      readOnly
                    />
                    <div
                      className={`absolute w-6 h-6 border border-gray-300 rounded-full shadow transform transition-transform ${
                        formdata.emailUpdate
                          ? "translate-x-6 bg-gray-200"
                          : "translate-x-0 bg-blue-600"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">
                  Two-Factor Authentication
                </span>
                <div
                  className={`relative flex items-center cursor-pointer ${
                    formdata.twoFactorAuth ? "text-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => handleToggle("twoFactorAuth")}
                >
                  <div
                    className={`${
                      formdata.twoFactorAuth ? "bg-blue-600" : "bg-gray-200"
                    } w-12 h-6 rounded-full shadow-inner duration-150 relative`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formdata.twoFactorAuth}
                      readOnly
                    />
                    <div
                      className={`absolute w-6 h-6 border border-gray-300 rounded-full shadow transform transition-transform ${
                        formdata.twoFactorAuth
                          ? "translate-x-6 bg-gray-200"
                          : "translate-x-0 bg-blue-600"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <label className="text-gray-600 font-medium block mb-2">
                  Language
                </label>
                <select
                  className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-black"
                  name="lang"
                  value={formdata.lang}
                  onChange={handleChange}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  {/* Add more language options here */}
                </select>
              </div>
              <h1 className="text-red-600 text-xl font-medium">Danger Zone!</h1>
              <div className="flex items-center justify-between">
                <h3 className="text-gray-600 font-medium block mb-2">
                  Delete your Account
                </h3>
                
                <button
                  onClick={handleDeleteAccount}
                  className="w-fit p-2 bg-red-600 text-white rounded-md text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            className="w-[10em] bg-indigo-600 text-white p-2 rounded-lg shadow-lg hover:bg-indigo-500 transition"
          >
            Save Changes
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
