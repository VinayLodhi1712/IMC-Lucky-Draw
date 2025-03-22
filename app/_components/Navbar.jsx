"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../_context/userAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    router.push("/login");
  };

  return (
    <header>
      {/* Top Bar */}

      {/* Logo Bar */}
      <div className="bg-blue-400 py-3">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-around">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <Link href="/">
                  <Image
                    src="/imclogo.png"
                    width={70}
                    height={70}
                    alt="IMC logo"
                  />
                </Link>
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-white tracking-wide">
                  INDORE MUNICIPAL
                </h1>
                <h1 className="font-extrabold text-xl text-center text-white tracking-wide">
                  {" "}
                  CORPORATION
                </h1>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  {/* Main Navigation */}
                  <div className="hidden md:block">
                    <div className="flex gap-10">
                      <Link
                        href="/"
                        className="text-white hover:bg-blue-500 px-4 py-3 font-medium transition-colors duration-200 rounded-2xl"
                      >
                        HOME
                      </Link>
                      <Link
                        href="/property"
                        className="text-white hover:bg-blue-500 px-4 py-3 font-medium transition-colors duration-200  rounded-2xl"
                      >
                        PROPERTY
                      </Link>
                      <Link
                        href="/water"
                        className="text-white hover:bg-blue-500 px-4 py-3 font-medium transition-colors duration-200 rounded-2xl"
                      >
                        WATER
                      </Link>
                      {auth?.user ? (
                        <Dialog
                          open={logoutModalOpen}
                          onOpenChange={setLogoutModalOpen}
                        >
                          <DialogTrigger asChild>
                            <button className="text-white hover:bg-blue-500 px-4 py-3 font-medium rounded-2xl">
                              LOGOUT
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>Confirm Logout</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to log out?
                            </DialogDescription>
                            <DialogFooter className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setLogoutModalOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleLogout}
                              >
                                Logout
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Link href="/login">
                          <button className="text-white hover:bg-blue-900 px-4 py-3 font-medium">
                            LOGIN
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="md:hidden flex items-center">
                    <button
                      onClick={toggleMenu}
                      className="text-white hover:bg-indigo-700 p-2 rounded-md focus:outline-none"
                    >
                      <span className="sr-only">Open main menu</span>
                      {!isOpen ? (
                        <svg
                          className="h-6 w-6"
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
                          className="h-6 w-6"
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
                <div className="px-2 pt-2 pb-3 space-y-1 border-t border-indigo-700">
                  <Link
                    href="/"
                    className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md font-medium"
                  >
                    HOME
                  </Link>
                  <Link
                    href="/property"
                    className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md font-medium"
                  >
                    PROPERTY
                  </Link>
                  <Link
                    href="/water"
                    className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md font-medium"
                  >
                    WATER
                  </Link>
                  <Link
                    href="/services"
                    className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md font-medium"
                  >
                    SERVICES
                  </Link>
                  <Link
                    href="/forms"
                    className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md font-medium"
                  >
                    FORMS
                  </Link>
                  {auth?.user ? (
                    <Dialog
                      open={logoutModalOpen}
                      onOpenChange={setLogoutModalOpen}
                    >
                      <DialogTrigger asChild>
                        <button className="text-white hover:bg-indigo-700 w-full text-left px-3 py-2 rounded-md font-medium">
                          LOGOUT
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to log out?
                        </DialogDescription>
                        <DialogFooter className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setLogoutModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleLogout}>
                            Logout
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Link href="/login">
                      <button className="text-white hover:bg-indigo-700 w-full text-left px-3 py-2 rounded-md font-medium">
                        LOGIN
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </nav>

            {/* right image  */}
            <div>
              <Image
                src="/digital-india.png"
                width={160}
                height={70}
                alt="Digital India logo"
                className="hidden md:block"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
