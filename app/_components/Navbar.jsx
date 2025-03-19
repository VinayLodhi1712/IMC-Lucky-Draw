"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../_context/userAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo on left side */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-white font-bold text-2xl">
              YourLogo
            </Link>
          </div>

          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-12">
              <Link
                href="/property"
                className="text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200"
              >
                Property
              </Link>
              <Link
                href="/water"
                className="text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200"
              >
                Water
              </Link>
            </div>
          </div>

          {/* Auth links on right side */}
          <div className="hidden md:flex md:items-center">
            {auth?.user ? (
              <button className="text-white hover:bg-indigo-700 px-5 py-2 rounded-md text-lg font-medium border border-white hover:border-transparent transition-all duration-200">
                Logout
              </button>
            ) : (
              <Link href="/login">
                {" "}
                <button className="text-white hover:bg-indigo-700 px-5 py-2 rounded-md text-lg font-medium border border-white hover:border-transparent transition-all duration-200">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-indigo-700 p-2 rounded-md focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
          <Link
            href="/property"
            className="text-white hover:bg-indigo-700 block px-3 py-3 rounded-md text-lg font-medium"
          >
            Property
          </Link>
          <Link
            href="/water"
            className="text-white hover:bg-indigo-700 block px-3 py-3 rounded-md text-lg font-medium"
          >
            Water
          </Link>
          {auth?.user ? (
            <button className="text-white hover:bg-indigo-700 w-full text-left px-3 py-3 rounded-md text-lg font-medium">
              Logout
            </button>
          ) : (
            <button className="text-white hover:bg-indigo-700 w-full text-left px-3 py-3 rounded-md text-lg font-medium">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
