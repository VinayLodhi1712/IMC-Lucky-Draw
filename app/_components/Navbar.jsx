"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../_context/userAuth";
import { useLanguage } from "../_context/uselanguage";
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
import { FaHome, FaBuilding, FaHandHoldingWater, FaAward } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { CiLogin } from "react-icons/ci";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [auth, setAuth] = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    router.push("/login");
  };

  const navItems = [
    { name: t("home"), href: "/", icon: <FaHome className="text-xl" /> },
    {
      name: t("property"),
      href: "/property",
      icon: <FaBuilding className="text-xl" />,
    },
    {
      name: t("water"),
      href: "/water",
      icon: <FaHandHoldingWater className="text-xl" />,
    },
    {
      name: t("winners"),
      href: "/winners",
      icon: <FaAward className="text-xl" />,
    },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-blue-900/95 via-navy-900/95 to-blue-900/95 backdrop-blur-md shadow-2xl border-b-2 border-yellow-400/30' 
          : 'bg-gradient-to-r from-blue-800/85 via-indigo-900/85 to-blue-800/85 backdrop-blur-lg border-b border-yellow-300/20'
      }`}
    >
      <div className="mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-6">
              <Link href="/" className="block">
                <div className="relative bg-yellow-400/10 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-yellow-300/20 hover:bg-yellow-400/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Image
                    src="/imc-logo.svg"
                    width={280}
                    height={60}
                    alt="IMC logo"
                    className="lg:w-[280px] w-[220px] lg:h-[60px] h-[50px] object-contain"
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex gap-6 items-center">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-white hover:text-yellow-300 lg:text-lg text-base font-semibold px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-3 hover:bg-yellow-400/10 backdrop-blur-sm border border-transparent hover:border-yellow-300/30 hover:shadow-md"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              {/* Auth Section */}
              {auth?.user ? (
                <Dialog
                  open={logoutModalOpen}
                  onOpenChange={setLogoutModalOpen}
                >
                  <DialogTrigger asChild>
                    <button className="text-white hover:text-red-300 px-4 py-3 font-semibold rounded-lg cursor-pointer flex gap-3 items-center transition-all duration-300 hover:bg-red-500/20 backdrop-blur-sm border border-transparent hover:border-red-400/30 hover:shadow-md">
                      <HiOutlineLogout className="text-xl" /> {t("logout")}
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>{t("confirmLogout")}</DialogTitle>
                    <DialogDescription>
                      {t("areYouSure")}
                    </DialogDescription>
                    <DialogFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setLogoutModalOpen(false)}
                      >
                        {t("cancel")}
                      </Button>
                      <Button onClick={handleLogout}>{t("logout")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Link href="/login">
                  <button className="text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 rounded-lg px-5 py-3 font-bold flex items-center gap-3 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-400/50 hover:scale-105">
                    <CiLogin className="text-xl" /> {t("login")}
                  </button>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <IconButton 
              onClick={() => setIsDrawerOpen(true)}
              className="p-3 text-white hover:bg-white/10 rounded-lg"
            >
              <MenuIcon className="text-white text-2xl" />
            </IconButton>
          </div>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            <div className="w-72 p-6 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 h-full text-white flex flex-col">
              <div className="flex justify-end mb-8">
                <IconButton onClick={() => setIsDrawerOpen(false)}>
                  <CloseIcon className="text-white hover:text-yellow-300 transition-all text-2xl" />
                </IconButton>
              </div>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center gap-4 text-lg font-semibold bg-white/10 hover:bg-yellow-400/20 p-4 rounded-lg transition-all duration-300 hover:transform hover:translateX-2 backdrop-blur-sm border border-white/10 hover:border-yellow-300/30"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}

                {auth?.user ? (
                  <button
                    className="flex items-center gap-4 text-lg font-semibold bg-red-500/20 hover:bg-red-500/30 p-4 rounded-lg transition-all duration-300 border border-red-400/30 backdrop-blur-sm"
                    onClick={handleLogout}
                  >
                    <HiOutlineLogout className="text-xl" />
                    {t("logout")}
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setIsDrawerOpen(false)}>
                    <button className="flex items-center gap-4 text-lg font-semibold bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 hover:from-yellow-500/40 hover:to-yellow-600/40 p-4 rounded-lg transition-all duration-300 border border-yellow-400/30 backdrop-blur-sm">
                      <CiLogin className="text-xl" />
                      {t("login")}
                    </button>
                  </Link>
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