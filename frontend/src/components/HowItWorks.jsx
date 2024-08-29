import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const HowItWorks = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const goBack = () => {
    navigate(-1);
  };
  return (
    <section className="bg-gray-50 text-gray-800 ">
      <div
        className={`${
          isLoggedIn ? "fixed" : "hidden"
        } p-3 shadow-xl lg:top-28 lg:left-4 md:top-24 top-16  left-2 text-white `}
      >
        <Link onClick={goBack} className="bg-indigo-700 p-3 rounded">
          Go back
        </Link>
      </div>
      <div className="container mx-auto pt-24 h-full">
        <h2 className="text-4xl text-center  font-extrabold">How It Works</h2>
        <div className="flex h-full flex-col my-10 justify-between items-center md:space-x-12 space-y-12 md:space-y-0">
          {/* Step 1: Audio Recording */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-full mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422A12.045 12.045 0 0021 12c0 6.627-5.373 12-12 12S0 18.627 0 12c0-.683.058-1.354.16-2.008L12 14z" />
                <path d="M12 14L6.16 10.578A12.045 12.045 0 013 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-.683-.058-1.354-.16-2.008L12 14z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Step 1: Record Audio
            </h3>
            <p>
              Start by recording your audio using the provided hardware setup.
              This could be from a lecture, meeting, or any other audio source.
            </p>
          </div>

          {/* Step 2: Data Transmission */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="bg-green-500 text-white w-16 h-16 flex items-center justify-center rounded-full mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 12h7M3 6h7M3 18h7m4-6h7m-7 6h7m-7-12h7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Step 2: Data Transmission
            </h3>
            <p>
              The recorded audio is sent to the server for processing. The data
              transmission is handled securely and efficiently.
            </p>
          </div>

          {/* Step 3: AI Processing */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="bg-purple-500 text-white w-16 h-16 flex items-center justify-center rounded-full mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                <path d="M14.31 8l-5.342 9.317L6 11.691l4.658-7.975A7.993 7.993 0 0112 4a7.993 7.993 0 011.342.715l-3.377 5.783 4.346 7.573A7.983 7.983 0 0112 20a7.993 7.993 0 01-1.342-.715l-3.377-5.783-4.346-7.573A7.993 7.993 0 0112 4a7.993 7.993 0 011.342.715l3.377 5.783z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Step 3: AI Processing
            </h3>
            <p>
              Our AI models process the audio to generate accurate notes. This
              step ensures that the final output is precise and useful.
            </p>
          </div>

          {/* Step 4: Notes Delivery */}
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="bg-red-500 text-white w-16 h-16 flex items-center justify-center rounded-full mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14m7-7H5" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">
              Step 4: Receive Your Notes
            </h3>
            <p>
              The processed notes are delivered back to your device and can be
              viewed on an LCD screen or through our web interface.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
