"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/userAuth";
import { apiRequest } from "@/lib/api";
import PulseLoader from "react-spinners/PulseLoader";

export default function CheckLogin(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        let storedAuth = localStorage.getItem("auth");
        storedAuth = storedAuth ? JSON.parse(storedAuth) : null;

        console.log("Stored Auth Before Sending:", storedAuth);

        if (!storedAuth || !storedAuth.token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setAuth(storedAuth);

        try {
          const data = await apiRequest('/userAuth', {
            headers: {
              Authorization: `Bearer ${storedAuth.token}`,
            },
          });

          if (data.success) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
        } finally {
          setLoading(false);
        }
      };

      if (typeof window !== "undefined") {
        checkAuth();
      }
    }, []);

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/login");
      }
    }, [loading, isAuthenticated, router]);

    if (loading) {
      return (
        <div className="w-full flex justify-center items-center">
          <p className="font-bold text-2xl sm:text-3xl flex justify-center gap-2 items-center h-screen w-full">
            Checking authentication
            <PulseLoader />
          </p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="w-full flex justify-center items-center">
          <p className="font-bold text-2xl sm:text-3xl flex justify-center gap-2 h-screen items-center w-full">
            Please login, redirecting... 
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
