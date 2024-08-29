import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios  from 'axios';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to send password reset email
      axios.post('http://localhost:4000/auth/forgot',{
      email: email,
    }).then((response) => {
      if(response.data.status==true)
        {
          toast.success('Password reset email sent to ' + email);
          navigate('/signin');
        }
        else{
          toast.error(response.data.message);
        }
    }).catch((error) => {
      toast.error(error.message);
    });
    
  };
  const goBack = () => {
    navigate(-1);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-3 shadow-xl lg:top-28 lg:left-4 md:top-24 top-16  left-2 text-white fixed"
      >
      <Link
        onClick={goBack}
        className="bg-indigo-700 p-3 rounded"
      >
        Go back
      </Link>
      </div>
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
