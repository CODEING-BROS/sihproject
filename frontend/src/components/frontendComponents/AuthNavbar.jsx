import React from "react";
import { Link } from "react-router-dom";

const AuthNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#010309] text-white border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-wide">DevPair</h1>
        {/* Optional: Add light/dark mode toggle or help link */}
        {/* <Link to="/about" className="text-gray-400 hover:text-white text-sm">About</Link> */}
      </div>
      {/* Optional: Links to switch between Login/Signup */}
      <nav className="text-sm">
        <Link to="/login" className="mx-2 text-gray-400 hover:text-white">
          Login
        </Link>
        <Link to="/signup" className="mx-2 text-gray-400 hover:text-white">
          Sign Up
        </Link>
      </nav>
    </header>
  );
};

export default AuthNavbar;
