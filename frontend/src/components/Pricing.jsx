import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-20 md:py-20 lg:py-12 px-4 sm:px-6 lg:px-8">
      {/* Go Back Button */}
      <div
        className={`${
          isLoggedIn ? "fixed" : "hidden"
        } p-3 shadow-xl lg:top-28 lg:left-4 md:top-24 top-16  left-2 text-white `}
      >
        <Link onClick={goBack} className="bg-indigo-700 p-3 rounded">
          Go back
        </Link>
      </div>

      {/* Pricing Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">Pricing Plans</h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose the plan that's right for you.
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-3 sm:grid-cols-1">
        {/* Basic Plan */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transform transition-transform hover:scale-105">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Basic</h2>
            <p className="mt-4 text-gray-600">A great plan to get started with.</p>
            <div className="mt-6">
              <span className="text-4xl font-extrabold text-gray-800">$9</span>
              <span className="text-base font-medium text-gray-600">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Feature 1</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Feature 2</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Feature 3</span>
              </li>
            </ul>
          </div>
          <button className="mt-8 w-full bg-indigo-600 text-white py-2 rounded-md text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Get Started
          </button>
        </div>

        {/* Standard Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between transform transition-transform hover:scale-105">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Standard</h2>
            <p className="mt-4 text-gray-600">Our most popular plan.</p>
            <div className="mt-6">
              <span className="text-4xl font-extrabold text-gray-800">$19</span>
              <span className="text-base font-medium text-gray-600">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Everything in Basic</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Advanced Feature 1</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Advanced Feature 2</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Priority Support</span>
              </li>
            </ul>
          </div>
          <button className="mt-8 w-full bg-indigo-600 text-white py-2 rounded-md text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Get Started
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transform transition-transform hover:scale-105">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Premium</h2>
            <p className="mt-4 text-gray-600">For businesses that need more.</p>
            <div className="mt-6">
              <span className="text-4xl font-extrabold text-gray-800">$29</span>
              <span className="text-base font-medium text-gray-600">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Everything in Standard</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Premium Feature 1</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Premium Feature 2</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-600">Dedicated Support</span>
              </li>
            </ul>
          </div>
          <button className="mt-8 w-full bg-indigo-600 text-white py-2 rounded-md text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
