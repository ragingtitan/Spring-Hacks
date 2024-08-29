import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "./AuthContext";

const Hero = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <header className="flex flex-col justify-center items-center text-center p-8 bg-gradient-to-b from-blue-500 to-indigo-700 text-white relative overflow-hidden pt-12">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-10">
          <img
            src="https://example.com/your-background-image.png"
            alt="Background Design"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:mt-20 lg:mt-20">
            Transform Your Recordings Into Notes Instantly
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mt-6 mx-auto">
            Use our AI-powered service to convert your voice recordings into
            well-organized, actionable notes. Perfect for meetings, lectures, and more.
          </p>

          <div className="flex justify-center space-x-4 mt-8">
            <div className="bg-white text-blue-600  rounded-full font-semibold text-lg shadow-lg transform transition hover:scale-105">
              {!isLoggedIn ? (
                <Link className='px-6 py-3 flex text-[1.12rem]' to='/signin'>Login to Get Started</Link>
              ) : (
                <Link className='px-6 py-3 flex text-[1.12rem]' to='/ainotesmaker'>Go to Notes Maker AI</Link>
              )}
            </div>
            <div className="bg-blue-600 text-white border border-white rounded-full flex font-semibold text-lg shadow-lg transform transition hover:scale-105">
              <Link className=' px-6 py-3 flex items-center text-[1.12rem]' to='/features'>Explore Features</Link>
            </div>
          </div>

          <div className="mt-10 text-sm text-gray-200">
            <p>
              Join thousands of professionals and students who use our service to
              stay organized and efficient.
            </p>
            <p>
              Start now and make your recordings work for you!
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-20 rounded-full transform scale-150 -translate-x-20 translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full transform scale-150 translate-x-20 translate-y-10"></div>
      </header>
    </>
  );
}

export default Hero;
