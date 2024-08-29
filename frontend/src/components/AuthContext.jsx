import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Create context
const AuthContext = createContext();

// Create provider component
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setusername] = useState("");
  const [dashboardEmail, setdashboardEmail] = useState("");
  const [dashboardBio, setdashboardBio] = useState("");
  const [dashboardphoneNumber, setdashboardphoneNumber] = useState("");
  const [theme, settheme] = useState(false);
  const [autoSave, setautoSave] = useState(true);
  const [lang, setlang] = useState("en");
  const [emailUpdate, setemailUpdate] = useState(true)
  const [twoFactorAuth, settwoFactorAuth] = useState(false)
  const [profilePicture, setprofilePicture] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const url = "http://localhost:4000/auth/verify";
        const res = await axios.get(url, { withCredentials: true });
        if (res.data.status) {
          setIsLoggedIn(true);
          setprofilePicture(res.data.profile.profilePicture)
          setdashboardBio(res.data.details.bio);
          setdashboardEmail(res.data.details.email);
          setdashboardphoneNumber(res.data.details.phoneNumber);
          setusername(res.data.details.username)
          setautoSave(res.data.settings.autoSave)
          setlang(res.data.settings.lang)
          settheme(res.data.settings.theme)
          setemailUpdate(res.data.settings.emailUpdate)
          toast.success(res.data)
          console.log(res.data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error(err.message);
        setIsLoggedIn(false)
      }
    };
    checkLogin();
  }, [navigate, isLoggedIn, dashboardBio, dashboardphoneNumber, profilePicture, username]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setusername,
        dashboardEmail,
        setdashboardEmail,
        dashboardBio,
        setdashboardBio,
        dashboardphoneNumber,
        setdashboardphoneNumber,
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
        profilePicture,
        setprofilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
