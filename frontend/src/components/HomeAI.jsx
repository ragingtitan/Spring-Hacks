import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAI from "./NavbarAI";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import FooterAI from "./FooterAI";
import axios from "axios";
import { CurrentChatProvider } from "./ChatContext";
import { toast } from "react-toastify";
const Body = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  useEffect(() => {
    const checkLogin = () => {
      const url = "http://localhost:4000/auth/verify";
      axios
        .get(url, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            setisLoggedIn(true);
          } else {
            toast.error(res.data.message);
            navigate("/signin");
          }
        })
        .catch((err) => {
          console.log(err.message);
          navigate("/signin");
        });
    };
    checkLogin();
  }, []);

  return (
    <div>
      <CurrentChatProvider>
        <NavbarAI />
        <Sidebar />
        <ChatArea />
      </CurrentChatProvider>
      <FooterAI />
    </div>
  );
};

export default Body;
