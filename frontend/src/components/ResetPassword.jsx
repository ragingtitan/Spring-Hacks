import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";



const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to reset password, for example, send a request to your backend
    if (password !== confirmPassword) {
      toast.success("Cannot Reset Password!"); //
    } else {
      axios
        .post("http://localhost:80/auth/reset/" + token, {
          password: password,
        })
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.msg);
          } else {
            toast.error(response.data.msg);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center shadow-lg bg-white p-4">
 <div className="p-3 shadow-xl lg:top-28 lg:left-4 md:top-24 top-16  left-2 text-white fixed"
      >
      <Link
        onClick={goBack}
        className="bg-indigo-700 p-3 rounded"
      >
        Go back
      </Link>
      </div>
  <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
      Reset Your Password
    </h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
      >
        Reset Password
      </button>
    </form>
  </div>
</div>

  );
};

export default ResetPassword;
