import React from "react";
import Not_Found from "../assets/notfound.png";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="notfound flex h-screen  justify-center items-center w-full mx-auto bg-white">
      <div className="p-3 shadow-xl lg:top-28 lg:left-4 md:top-24 top-16  left-2 text-white fixed"
      >
      <Link
        onClick={goBack}
        className="bg-indigo-700 p-3 rounded"
      >
        Go back
      </Link>
      </div>
      </div>
    </>
  );
};

export default NotFound;
