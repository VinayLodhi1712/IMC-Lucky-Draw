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
import { FaHome, FaBuilding, FaHandHoldingWater } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

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

  const navItems = [
    { name: "HOME", href: "/", icon: <FaHome className="text-xl" /> },
    {
      name: "PROPERTY",
      href: "/property",
      icon: <FaBuilding className="text-xl" />,
    },
    {
      name: "WATER",
      href: "/water",
      icon: <FaHandHoldingWater className="text-xl" />,
    },
  ];

  return (
    <header className="fixed w-full z-[2]">
      <div className="mx-auto py-3 px-4 sm:px-6 lg:px-8 bg-[rgba(60,60,60,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <Link href="/">
                <Image
                  src="/imc-logo.svg"
                  width={300}
                  height={300}
                  alt="IMC logo"
                  className="lg:w-[300px] w-[200px]"
                />
              </Link>
            </div>
          </div>
          <nav className="hidden md:block">
            <div className="flex gap-10">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-white  lg:text-lg  text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[rgba(60,60,60,0.3)] hover:shadow-md cursor-pointer flex items-center gap-2"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              {auth?.user ? (
                <Dialog
                  open={logoutModalOpen}
                  onOpenChange={setLogoutModalOpen}
                >
                  <DialogTrigger asChild>
                    <button className="text-white bg-[rgba(60,60,60,0.3)]  px-4 py-3 font-medium rounded-2xl cursor-pointer flex gap-2 items-center">
                      <HiOutlineLogout className="text-xl" /> LOGOUT
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
                      <Button onClick={handleLogout}>Logout</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Link href="/login">
                  <button className="text-white bg-[rgba(60,60,60,0.3)]  px-4 py-3 font-medium">
                    LOGIN
                  </button>
                </Link>
              )}
            </div>
          </nav>
          <div className="md:hidden">
            <IconButton onClick={() => setIsDrawerOpen(true)}>
              <MenuIcon className="text-white" />
            </IconButton>
          </div>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            <div className="w-64 p-6 bg-[#1E3E62] h-full text-white flex flex-col">
              <div className="flex justify-end mb-4">
                <IconButton onClick={() => setIsDrawerOpen(false)}>
                  <CloseIcon className="text-white hover:text-gray-200 transition-all" />
                </IconButton>
              </div>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 text-lg font-medium bg-[rgba(60,60,60,0.3)]  p-2 rounded-lg transition-all"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
                {auth?.user && (
                  <button
                    className="flex items-center gap-3 text-lg font-medium bg-[rgba(60,60,60,0.3)]  p-2 rounded-lg transition-all"
                    onClick={handleLogout}
                  >
                    <HiOutlineLogout className="text-xl" />
                    LOGOUT
                  </button>
                )}
              </nav>
            </div>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
