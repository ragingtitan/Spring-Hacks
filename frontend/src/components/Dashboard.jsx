import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import ProfilePictureGenerator from "./ProfilePictureGenerator";
import "../Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
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
    profilePicture, 
    setprofilePicture
  } = useContext(AuthContext);

  const [hasChanged, sethasChanged] = useState(false);
  const [formdata, setformdata] = useState({
    bio: dashboardBio || "",
    phoneNumber: dashboardphoneNumber || "",
  });

  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const updateProfile = async (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      let url = "http://localhost:4000/auth/updateProfile/";
      let response = await axios.post(url, formdata);
      if (response.data.status) {
        toast.success(response.data.message);
        const { bio, phoneNumber } = response.data.details;
        setdashboardBio(bio);
        setdashboardphoneNumber(phoneNumber);
        setformdata({ bio, phoneNumber });
        sethasChanged(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    sethasChanged(true);
    setformdata((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    let url = "http://localhost:4000/auth/verify/";
    axios
      .get(url, { withCredentials: true })
      .then((response) => {
        if (response.data.status) {
          setIsLoggedIn(true);
          setformdata({
            bio: response.data.details.bio || "",
            phoneNumber: response.data.details.phoneNumber || "",
          });
        } else {
          setIsLoggedIn(false);
          toast.error(response.data.message);
          navigate("/signin");
        }
      })
      .catch((err) => {
        toast.error(err.message);
        navigate("/signin");
      });
  }, [dashboardBio, dashboardphoneNumber, navigate, setIsLoggedIn, imageSrc]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        let url = "http://localhost:4000/auth/profilepic";
        const response = await axios.get(url, { responseType: 'blob', withCredentials: true });
        if (response.status === 200) {
          const blob = response.data;
          const url = URL.createObjectURL(blob);
          console.log(response)
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
  }, []);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const uploadProfilePicture = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("uploaded_file", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/uploadProfilePic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Enable credentials to include cookies
        }
      );
    
      const result = response.data;
      console.log("File uploaded:", result);
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 overflow-auto py-12">
      <div className="container mx-auto px-4">
        <div className="fixed lg:top-28 lg:left-4 md:top-28 top-16 left-2">
          <Link
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white p-3 rounded shadow-lg hover:bg-indigo-500 transition"
          >
            Go Back
          </Link>
        </div>
        <form
          className="bg-white border border-gray-300 shadow-lg rounded-lg p-8 mx-auto max-w-3xl mt-16"
          onSubmit={updateProfile}
        >
          <div className="profile-container flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
              Profile
            </h1>
            <div className="flex w-full justify-center flex-col items-center">
              <div className="profile-picture flex justify-center border-2 border-blue-500 overflow-hidden w-1/3 bg-gray-200 p-4 rounded-lg shadow-md">
                
                {!profilePicture?(<ProfilePictureGenerator seed={username}  width={95}/>):(<img src={imageSrc} alt="Profile"/>)}
            
              </div>
              <div className={`flex items-center justify-center my-5 ${profilePicture?"hidden":""}`}>
                <label
                  htmlFor="upload-button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                >
                  Upload Your Photo
                </label>
                <input
                  id="upload-button"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={uploadProfilePicture}
                  className="ml-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Upload
                </button>
              </div>
              <div className="mt-6 text-lg text-gray-600 w-full justify-start">
                <div className="flex flex-col sm:flex-row gap-2 justify-start">
                  <span className="font-bold">Username:</span>
                  <input type="text" value={username} readOnly />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-start mt-2">
                  <span className="font-bold">Email:</span>
                  <input type="text" value={dashboardEmail} readOnly />
                </div>
              </div>
            </div>
            <div className="w-full space-y-6">
              <div className="flex flex-col gap-2 text-lg text-gray-600">
                <label className="font-bold" htmlFor="bio">
                  Bio:
                </label>
                <textarea
                  value={formdata.bio}
                  name="bio"
                  placeholder="Tell us something about yourself..."
                  className=" p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="flex flex-col gap-2 text-lg text-gray-600">
                <label className="font-bold" htmlFor="phoneNumber">
                  Phone Number:
                </label>
                <input
                  value={formdata.phoneNumber}
                  className="p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              disabled={!hasChanged}
              className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed p-4 mt-6 rounded-md text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="submit"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
