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
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    router.push("/login");
  };

  return (
    <header>
      {/* Logo Bar */}
      <div className="bg-blue-400 py-3">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
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
                  CORPORATION
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="flex gap-10">
                <Link
                  href="/"
                  className="text-white hover:bg-blue-500 px-4 py-3 font-medium rounded-2xl"
                >
                  HOME
                </Link>
                <Link
                  href="/property"
                  className="text-white hover:bg-blue-500 px-4 py-3 font-medium rounded-2xl"
                >
                  PROPERTY
                </Link>
                <Link
                  href="/water"
                  className="text-white hover:bg-blue-500 px-4 py-3 font-medium rounded-2xl"
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
                        <Button variant="destructive" onClick={handleLogout}>
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
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <IconButton onClick={() => setIsDrawerOpen(true)}>
                <MenuIcon className="text-white" />
              </IconButton>
            </div>

            {/* MUI Drawer for Mobile Menu */}
            <Drawer
              anchor="left"
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
            >
              <div className="w-64 p-4 bg-blue-500 h-full text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Menu</h2>
                  <IconButton onClick={() => setIsDrawerOpen(false)}>
                    <CloseIcon className="text-white" />
                  </IconButton>
                </div>
                <nav className="flex flex-col space-y-3">
                  <Link
                    href="/"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    HOME
                  </Link>
                  <Link
                    href="/property"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    PROPERTY
                  </Link>
                  <Link
                    href="/water"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    WATER
                  </Link>
                  {auth?.user ? (
                    <Dialog
                      open={logoutModalOpen}
                      onOpenChange={setLogoutModalOpen}
                    >
                      <DialogTrigger asChild>
                        <button className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium w-full text-left">
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
                      <button className="hover:bg-blue-700 px-3 py-2 rounded-md font-medium w-full text-left">
                        LOGIN
                      </button>
                    </Link>
                  )}
                </nav>
              </div>
            </Drawer>

            {/* Right Image */}
            <div className="hidden md:block">
              <Image
                src="/digital-india.png"
                width={160}
                height={70}
                alt="Digital India logo"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
